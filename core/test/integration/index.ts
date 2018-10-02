import { mkdirSync, removeSync, existsSync, writeFileSync } from 'fs-extra';

import {
  DatabaseConnector,
  Database,
  defaultDatabaseConfigObject,
} from '../../src/database';
import { DeepPartial } from '../../src/common';
import { Seeder, SeederConfig } from '../../src';
import { listExistingCollections, createCollection } from '../_helpers';

const DATABASE_NAME = 'coredb';
const TEMP_DIRECTORY_PATH = __dirname + '/.temp-seedDatabase';

const databaseConnector = new DatabaseConnector();
let database: Database;

beforeAll(async () => {
  database = await databaseConnector.connect({
    ...defaultDatabaseConfigObject,
    name: DATABASE_NAME,
  });
  await database.drop();
});

beforeEach(async () => {
  if (!existsSync(TEMP_DIRECTORY_PATH)) {
    mkdirSync(TEMP_DIRECTORY_PATH);
  } else {
    removeSync(TEMP_DIRECTORY_PATH);
  }
});

afterEach(async () => {
  await database.drop();
  removeSync(TEMP_DIRECTORY_PATH);
});

afterAll(async () => {
  await databaseConnector.close();
});

function createSampleFiles(collectionNames: string[], directoryPath: string) {
  const collectionPaths = collectionNames.map(collectionName => {
    const collectionPath = `${directoryPath}/${collectionName}`;
    mkdirSync(collectionPath);
    return collectionPath;
  });

  writeFileSync(
    `${collectionPaths[0]}/test1.json`,
    JSON.stringify({
      id: 'testing',
      number: 1,
      name: 'one',
    }),
  );
  writeFileSync(
    `${collectionPaths[0]}/test2.js`,
    `module.exports = {
          number: 2,
          name: "two"
      }`,
  );
  writeFileSync(
    `${collectionPaths[1]}/test3.json`,
    JSON.stringify([
      { id: 'test', number: 3, name: 'three' },
      { number: 4, name: 'four' },
    ]),
  );
}

describe('Mongo Seeding', () => {
  it('should import documents into collections', async () => {
    const expectedCollectionNames = ['CollectionOne', 'CollectionTwo'];
    createSampleFiles(expectedCollectionNames, TEMP_DIRECTORY_PATH);

    const config: DeepPartial<SeederConfig> = {
      database: {
        name: DATABASE_NAME,
      },
    };
    const path = TEMP_DIRECTORY_PATH;
    const seeder = new Seeder(config);
    const collections = seeder.readCollectionsFromPath(path, {
      transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
    });

    await expect(seeder.import(collections)).resolves.toBeUndefined();
    await expect(database.db.listCollections().toArray()).resolves.toHaveLength(
      2,
    );

    const collection1Documents = await database.db
      .collection(expectedCollectionNames[0])
      .find()
      .toArray();
    const collection2Documents = await database.db
      .collection(expectedCollectionNames[1])
      .find()
      .toArray();
    expect(collection1Documents).toContainEqual(
      expect.objectContaining({
        _id: 'testing',
        number: 1,
        name: 'one',
      }),
    );
    expect(collection1Documents).toContainEqual(
      expect.objectContaining({
        number: 2,
        name: 'two',
      }),
    );
    expect(collection2Documents).toContainEqual({
      _id: 'test',
      number: 3,
      name: 'three',
    });
    expect(collection2Documents).toContainEqual(
      expect.objectContaining({
        number: 4,
        name: 'four',
      }),
    );
  });

  it('should drop database before importing data', async () => {
    const expectedCollectionNames = ['CollectionOne', 'CollectionTwo'];
    createSampleFiles(expectedCollectionNames, TEMP_DIRECTORY_PATH);

    const config: DeepPartial<SeederConfig> = {
      database: {
        name: DATABASE_NAME,
      },
      dropDatabase: true,
    };

    await createCollection(database.db, 'ShouldBeRemoved');

    const path = TEMP_DIRECTORY_PATH;
    const seeder = new Seeder();
    const collections = seeder.readCollectionsFromPath(path);

    await expect(seeder.import(collections, config)).resolves.toBeUndefined();
    const dbCollections = await listExistingCollections(database.db);
    expect(dbCollections).toHaveLength(2);
    expect(dbCollections).toContainEqual('CollectionOne');
    expect(dbCollections).toContainEqual('CollectionTwo');
  });

  it('should drop collections before importing data', async () => {
    const expectedCollectionNames = ['CollectionOne', 'CollectionTwo'];
    createSampleFiles(expectedCollectionNames, TEMP_DIRECTORY_PATH);

    await createCollection(database.db, 'CollectionOne');
    await createCollection(database.db, 'ShouldNotBeRemoved');

    const config: DeepPartial<SeederConfig> = {
      database: {
        name: DATABASE_NAME,
      },
      dropCollections: true,
    };

    const path = TEMP_DIRECTORY_PATH;
    const seeder = new Seeder(config);
    const collections = seeder.readCollectionsFromPath(path);

    await expect(seeder.import(collections)).resolves.toBeUndefined();

    const dbCollections = await listExistingCollections(database.db);
    expect(dbCollections).toHaveLength(3);
    expect(dbCollections).toContainEqual('CollectionOne');
    expect(dbCollections).toContainEqual('CollectionTwo');
    expect(dbCollections).toContainEqual('ShouldNotBeRemoved');
  });

  it('should throw error when wrong path given', async () => {
    const seeder = new Seeder();
    await expect(() =>
      seeder.readCollectionsFromPath('/this/path/surely/doesnt/exist'),
    ).toThrowError('Error: ENOENT');
  });

  it('should throw error when cannot connect to database', async () => {
    const expectedCollectionNames = ['Collection1', 'Collection2'];
    createSampleFiles(expectedCollectionNames, TEMP_DIRECTORY_PATH);
    const config: DeepPartial<SeederConfig> = {
      database: 'mongodb://unresolved.host:27017/name',
      databaseReconnectTimeout: 0,
    };

    const path = TEMP_DIRECTORY_PATH;
    const seeder = new Seeder(config);
    const collections = seeder.readCollectionsFromPath(path);

    await expect(seeder.import(collections)).rejects.toThrowError('Timeout');
  });
});
