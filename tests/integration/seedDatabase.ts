import { MongoClient } from 'mongodb';
import { mkdirSync, removeSync, existsSync, writeFileSync } from 'fs-extra';

import { DatabaseConnector, Database } from '../../src/database';
import { defaultConfig, DeepPartial, AppConfig } from '../../src/common';
import { seedDatabase } from '../../src/index';
import { listExistingCollections, createCollection } from '../_helpers';

const DATABASE_NAME = 'seedDatabase';
const TEMP_DIRECTORY_PATH = __dirname + '/.temp-seedDatabase';

const databaseConnector = new DatabaseConnector(new MongoClient(), 3);
let database: Database;

beforeAll(async () => {
  database = await databaseConnector.connect({
    databaseConfig: {
      ...defaultConfig.database,
      name: DATABASE_NAME,
    }
  }
  );
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

    const config: DeepPartial<AppConfig> = {
      inputPath: TEMP_DIRECTORY_PATH,
      database: {
        name: DATABASE_NAME,
      },
      replaceIdWithUnderscoreId: true,
    };

    await expect(seedDatabase(config)).resolves.toBeUndefined();
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

    const config: DeepPartial<AppConfig> = {
      inputPath: TEMP_DIRECTORY_PATH,
      database: {
        name: DATABASE_NAME,
      },
      dropDatabase: true,
    };

    await createCollection(database.db, 'ShouldBeRemoved');

    await expect(seedDatabase(config)).resolves.toBeUndefined();
    const collections = await listExistingCollections(database.db);
    expect(collections).toHaveLength(2);
    expect(collections).toContainEqual('CollectionOne');
    expect(collections).toContainEqual('CollectionTwo');
  });

  it('should throw error when wrong path given', async () => {
    const config: DeepPartial<AppConfig> = {
      inputPath: '/this/path/surely/doesnt/exist',
    };
    await expect(seedDatabase(config)).rejects.toThrowError('Error: ENOENT');
  });

  it('should throw error when cannot connect to database', async () => {
    const expectedCollectionNames = ['Collection1', 'Collection2'];
    createSampleFiles(expectedCollectionNames, TEMP_DIRECTORY_PATH);
    const config: DeepPartial<AppConfig> = {
      databaseConnectionUri: "mongodb://unresolved.host:27017/name",
      reconnectTimeoutInSeconds: 0,
      inputPath: TEMP_DIRECTORY_PATH
    }
    await expect(seedDatabase(config)).rejects.toThrowError("Timeout");
  })
});
