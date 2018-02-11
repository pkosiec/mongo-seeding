import { MongoClient } from 'mongodb';

import { DatabaseConnector, Database } from '../../src/database';
import { defaultConfig } from '../../src/common';
import {
  removeUnderscoreIdProperty,
  createCollection,
  listExistingCollections,
} from '../helpers';

const databaseConnector = new DatabaseConnector(new MongoClient());
let database: Database;

beforeAll(async () => {
  database = await databaseConnector.connect(
    {
      ...defaultConfig.database,
      name: 'Database',
    },
    10,
  );
  await database.db.dropDatabase();
});

afterEach(async () => {
  await database.db.dropDatabase();
});

afterAll(async () => {
  await databaseConnector.close();
});

describe('Database module', () => {
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

    expect(result).toHaveLength(documents.length);
    expect(result.map(removeUnderscoreIdProperty)).toEqual(documents);
    expect(result).not.toEqual(documents);
  });

  it('should drop database', async () => {
    await createCollection(database.db, 'first');
    await createCollection(database.db, 'second');

    const collections = await listExistingCollections(database.db);
    await expect(collections).toHaveLength(2);
    await expect(collections).toContainEqual('first');
    await expect(collections).toContainEqual('second');

    await database.drop();
    await expect(listExistingCollections(database.db)).resolves.toEqual([]);
  });
});
