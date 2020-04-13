import {
  DatabaseConnector,
  defaultDatabaseConfigObject,
  Database,
} from '../../src/database';
import {
  removeUnderscoreIdProperty,
  createCollection,
  listExistingCollections,
} from '../_helpers';

const databaseConnector = new DatabaseConnector();
let database: Database;

beforeAll(async () => {
  database = await databaseConnector.connect({
    ...defaultDatabaseConfigObject,
    name: 'coredb',
  });
  await database.db.dropDatabase();
});

afterEach(async () => {
  await database.db.dropDatabase();
});

afterAll(async () => {
  await database.closeConnection();
});

describe('Database', () => {
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
    const collection = 'db-insert-docs';

    await database.insertDocumentsIntoCollection(documents, collection);
    const result = await database.db.collection(collection).find().toArray();

    expect(result).toHaveLength(documents.length);
    expect(result.map(removeUnderscoreIdProperty)).toEqual(documents);
    expect(result).not.toEqual(documents);
  });

  it('should drop database', async () => {
    const expectedCollections = ['db-drop-first', 'db-drop-second'];

    for (const collection of expectedCollections) {
      await createCollection(database.db, collection);
    }

    const collections = await listExistingCollections(database.db);

    await expect(collections).toHaveLength(expectedCollections.length);
    for (const collection of expectedCollections) {
      await expect(collections).toContainEqual(collection);
    }

    await database.drop();

    await expect(listExistingCollections(database.db)).resolves.toEqual([]);
  });

  it('should drop collection', async () => {
    const expectedCollections = ['db-drop-col-first', 'db-drop-col-second'];

    for (const collection of expectedCollections) {
      await createCollection(database.db, collection);
    }

    await database.dropCollectionIfExists(expectedCollections[0]);
    await expect(listExistingCollections(database.db)).resolves.toEqual([
      expectedCollections[1],
    ]);
  });
});
