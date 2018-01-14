import { MongoClient } from 'mongodb';

import { defaultConfig } from '../../src/config';
import { DatabaseConnector } from '../../src/DatabaseConnector';
import { Database } from '../../src/Database';

const databaseConnector = new DatabaseConnector(new MongoClient());
let database: Database;

beforeAll(async () => {
  database = await databaseConnector.connect(defaultConfig.database);
  await database.db.dropDatabase();
});

afterEach(async () => {
  await database.db.dropDatabase();
});

afterAll(async () => {
  await databaseConnector.close();
});

describe('Doing database operations', () => {
  it('should get collections names in form of array', async () => {
    await database.db.createCollection('test');
    await database.db.createCollection('test2');
    const result = await database.getExistingCollectionsArray();
    expect(result).toEqual(['test', 'test2']);
  });

  it('should be able to create collection', async () => {
    await database.createCollection('testingCollection');
    await expect(database.getExistingCollectionsArray()).resolves.toContain(
      'testingCollection',
    );
  });

  it('should insert documents into collection', async () => {
    const documents = [
      {
        value: 1,
      },
      {
        name: 'two',
        value: 2,
      },
      {
        value: 3,
        object: {
          name: 'three',
        },
      },
    ];
    const collection = 'testingCollection';
    await database.insertDocumentsIntoCollection(documents, collection);
    const result = await database.db
      .collection(collection)
      .find()
      .toArray();

    const resultWithoutId = result.map(document => {
      const newDocument = { ...document };
      delete newDocument._id;
      return newDocument;
    });
    expect(resultWithoutId).toEqual(documents);
  });

  it('should not mutate documents during inserting', async () => {
    const documents = [
      {
        value: 1,
      },
      {
        name: 'two',
        value: 2,
      },
      {
        value: 3,
        object: {
          name: 'three',
        },
      },
    ];
    const collection = 'testingCollection';
    await database.insertDocumentsIntoCollection(documents, collection);
    const result = await database.db
      .collection(collection)
      .find()
      .toArray();
    expect(result).toHaveLength(documents.length);
    expect(result).not.toEqual(documents);
  });

  it('should drop database', async () => {
    await database.createCollection('first');
    await database.createCollection('second');
    const collections = await database.getExistingCollectionsArray();
    await expect(collections).toHaveLength(2);
    await expect(collections).toContainEqual('first');
    await expect(collections).toContainEqual('second');
    await database.drop();
    await expect(database.getExistingCollectionsArray()).resolves.toEqual([]);
  });
});
