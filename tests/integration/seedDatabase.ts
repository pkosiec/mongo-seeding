import { mkdirSync, removeSync, existsSync, writeFileSync } from 'fs-extra';
import { MongoClient } from 'mongodb';

import { DeepPartial, AppConfig, defaultConfig } from '../../src/config';
import { seedDatabase } from '../../src/index';
import { DatabaseConnector } from '../../src/DatabaseConnector';
import { Database } from '../../src/Database';

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
  }
});

afterEach(async () => {
  await database.drop();
  removeSync(TEMP_DIRECTORY_PATH);
});

afterAll(async () => {
  await databaseConnector.close();
});

describe('Seeding database', () => {
  it('should import documents into collections', async () => {
    const collection1 = 'CollectionOne';
    const collection2 = 'CollectionTwo';
    const collection1Path = `${TEMP_DIRECTORY_PATH}/${collection1}`;
    const collection2Path = `${TEMP_DIRECTORY_PATH}/${collection2}`;
    mkdirSync(collection1Path);
    mkdirSync(collection2Path);

    writeFileSync(
      `${collection1Path}/test1.json`,
      JSON.stringify({
        number: 1,
        name: 'one',
      }),
    );
    writeFileSync(
      `${collection1Path}/test2.js`,
      `module.exports = {
            number: 2,
            name: "two"
        }`,
    );
    writeFileSync(
      `${collection2Path}/test3.json`,
      JSON.stringify([
        { number: 3, name: 'three' },
        { number: 4, name: 'four' },
      ]),
    );

    const config: DeepPartial<AppConfig> = {
      dataPath: TEMP_DIRECTORY_PATH,
      database: {
        name: DATABASE_NAME,
      },
    };

    await expect(seedDatabase(config)).resolves.toBeUndefined();

    const collectionArray = await database.getExistingCollectionsArray();
    expect(collectionArray).toHaveLength(2);
    expect(collectionArray).toContainEqual(collection1);
    expect(collectionArray).toContainEqual(collection2);
    const collection1Documents = await database.db
      .collection(collection1)
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
    const collection2Documents = await database.db
      .collection(collection2)
      .find()
      .toArray();
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
      dataPath: '/this/path/surely/doesnt/exist',
    };
    await expect(seedDatabase(config)).rejects.toThrowError(
      "Error: ENOENT: no such file or directory, scandir '/this/path/surely/doesnt/exist",
    );
  });
});
