import { MongoClient } from 'mongodb';
import { mkdirSync, removeSync, existsSync, writeFileSync } from 'fs-extra';

import {
  defaultConfig,
  AppConfig,
  DeepPartial,
  getConfig,
} from '../../src/config';
import { DataImporter } from '../../src/DataImporter';
import { DatabaseConnector } from '../../src/DatabaseConnector';

const TEMP_DIRECTORY_PATH = __dirname + '/_temp-DataImporter';

const databaseConnector = new DatabaseConnector(new MongoClient());
let dataImporter: DataImporter;

beforeAll(async () => {
  const database = await databaseConnector.connect(defaultConfig.database);
  dataImporter = new DataImporter(database);
  await dataImporter.db.drop();
});

beforeEach(async () => {
  if (!existsSync(TEMP_DIRECTORY_PATH)) {
    mkdirSync(TEMP_DIRECTORY_PATH);
  }
});

afterEach(async () => {
  await dataImporter.db.drop();
  removeSync(TEMP_DIRECTORY_PATH);
});

afterAll(async () => {
  await databaseConnector.close();
});

describe('Importing data', () => {
  it('should import object into collection', async () => {
    const collection = 'CollectionOne';
    const collectionPath = `${TEMP_DIRECTORY_PATH}/${collection}`;
    mkdirSync(collectionPath);

    writeFileSync(
      `${collectionPath}/test1.json`,
      JSON.stringify({
        number: 1,
        name: 'one',
      }),
    );

    const ownConfig: DeepPartial<AppConfig> = {
      dataPath: TEMP_DIRECTORY_PATH,
    };
    const config = getConfig(ownConfig);
    await dataImporter.importData(config);
    const collectionArray = await dataImporter.db.getExistingCollectionsArray();
    expect(collectionArray).toContainEqual(collection);
    const collectionDocuments = await dataImporter.db.db
      .collection(collection)
      .find()
      .toArray();
    expect(collectionDocuments).toContainEqual(
      expect.objectContaining({
        number: 1,
        name: 'one',
      }),
    );
  });

  it('should import array of objects into collection', async () => {
    const collection = 'CollectionTwo';
    const collectionPath = `${TEMP_DIRECTORY_PATH}/${collection}`;
    mkdirSync(collectionPath);

    writeFileSync(
      `${collectionPath}/test1.js`,
      `
      module.exports = [
        {
            number: 1,
            name: 'one',
        },
          {
              number: 2,
              name: 'two',
          }
      ]`,
    );

    const ownConfig: DeepPartial<AppConfig> = {
      dataPath: TEMP_DIRECTORY_PATH,
    };
    const config = getConfig(ownConfig);
    await dataImporter.importData(config);
    const collectionArray = await dataImporter.db.getExistingCollectionsArray();
    expect(collectionArray).toContainEqual(collection);
    const collectionDocuments = await dataImporter.db.db
      .collection(collection)
      .find()
      .toArray();
    expect(collectionDocuments).toContainEqual(
      expect.objectContaining({
        number: 1,
        name: 'one',
      }),
    );
    expect(collectionDocuments).toContainEqual(
      expect.objectContaining({
        number: 2,
        name: 'two',
      }),
    );
  });

  it('should insert document with custom id', async () => {
    const collection = 'CollectionThree';
    const collectionPath = `${TEMP_DIRECTORY_PATH}/${collection}`;
    mkdirSync(collectionPath);

    writeFileSync(
      `${collectionPath}/test1.js`,
      `
      module.exports = {
        id: "test",
        number: 1,
        name: 'one',
      }`,
    );

    const ownConfig: DeepPartial<AppConfig> = {
      dataPath: TEMP_DIRECTORY_PATH,
      replaceIdWithUnderscoreId: true,
    };
    const config = getConfig(ownConfig);
    await dataImporter.importData(config);
    const collectionArray = await dataImporter.db.getExistingCollectionsArray();
    expect(collectionArray).toContainEqual(collection);
    const collectionDocuments = await dataImporter.db.db
      .collection(collection)
      .find()
      .toArray();
    expect(collectionDocuments).toContainEqual({
      _id: 'test',
      number: 1,
      name: 'one',
    });
  });

  it('should skip empty directories', async () => {
    mkdirSync(`${TEMP_DIRECTORY_PATH}/emptyCollection`);
    const ownConfig: DeepPartial<AppConfig> = {
      dataPath: TEMP_DIRECTORY_PATH,
    };
    const config = getConfig(ownConfig);
    await dataImporter.importData(config);
    const collectionArray = await dataImporter.db.getExistingCollectionsArray();
    expect(collectionArray).not.toContainEqual('emptyCollection');
  });

  it('should skip unsupported files', async () => {
    const collection = 'CollectionFour';
    const collectionPath = `${TEMP_DIRECTORY_PATH}/${collection}`;
    mkdirSync(collectionPath);

    writeFileSync(
      `${collectionPath}/test1.md`,
      'Hello',
    );

    const ownConfig: DeepPartial<AppConfig> = {
      dataPath: TEMP_DIRECTORY_PATH,
      replaceIdWithUnderscoreId: true,
      supportedExtensions: ['js', 'json']
    };

    const config = getConfig(ownConfig);
    await dataImporter.importData(config);
    const collectionArray = await dataImporter.db.getExistingCollectionsArray();
    expect(collectionArray).toContainEqual(collection);
    const collectionDocuments = await dataImporter.db.db
      .collection(collection)
      .find()
      .toArray();
    expect(collectionDocuments).toHaveLength(0);
  });

  it('should fail when directory is not found', async () => {
    const ownConfig: DeepPartial<AppConfig> = {
      dataPath: '/surely/not/existing/path',
    };
    const config = getConfig(ownConfig);
    await expect(dataImporter.importData(config)).rejects.toThrowError(
      'ENOENT',
    );
  });
});
