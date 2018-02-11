import { MongoClient } from 'mongodb';
import { mkdirSync, removeSync, existsSync, writeFileSync } from 'fs-extra';

import { DatabaseConnector, Database } from '../../src/database';
import { defaultConfig, DeepPartial, AppConfig } from '../../src/common';
import { seedDatabase } from '../../src/index';

const DATABASE_NAME = 'seedDatabase';
const TEMP_DIRECTORY_PATH = __dirname + '/_temp-seedDatabase';

const databaseConnector = new DatabaseConnector(new MongoClient());
let database: Database;

beforeAll(async () => {
  database = await databaseConnector.connect(
    {
      ...defaultConfig.database,
      name: DATABASE_NAME,
    },
    3,
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
    JSON.stringify([{ number: 3, name: 'three' }, { number: 4, name: 'four' }]),
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
    expect(collection2Documents).toContainEqual(
      expect.objectContaining({
        number: 3,
        name: 'three',
      }),
    );
    expect(collection2Documents).toContainEqual(
      expect.objectContaining({
        number: 4,
        name: 'four',
      }),
    );
  });

  it('should throw error when wrong path given', async () => {
    const config: DeepPartial<AppConfig> = {
      inputPath: '/this/path/surely/doesnt/exist',
    };
    await expect(seedDatabase(config)).rejects.toThrowError(
      "Error: ENOENT: no such file or directory, scandir '/this/path/surely/doesnt/exist",
    );
  });
});
