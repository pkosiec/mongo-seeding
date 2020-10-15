import {
  DatabaseConnector,
  Database,
  defaultDatabaseConfigObject,
} from '../../src/database';
import { DeepPartial } from '../../src/common';
import { Seeder, SeederConfig } from '../../src';
import { listExistingCollections, createCollection } from '../_helpers';

const DATABASE_NAME = 'core-integration';
const IMPORT_DATA_DIR = __dirname + '/_importdata';

interface ExpectedDatabaseState {
  [key: string]: object[];
}

const databaseConnector = new DatabaseConnector();
let database: Database;

beforeAll(async () => {
  database = await databaseConnector.connect({
    ...defaultDatabaseConfigObject,
    name: DATABASE_NAME,
  });
  await database.drop();
});

afterEach(async () => {
  await database.drop();
});

afterAll(async () => {
  await database.closeConnection();
});

describe('Mongo Seeding', () => {
  it('should import documents into collections', async () => {
    const expectedDatabaseState: ExpectedDatabaseState = {
      'import-one': [
        {
          _id: 'testing',
          number: 1,
          name: 'one',
        },
        {
          number: 2,
          name: 'two',
        },
      ],
      'import-two': [
        {
          _id: 'test',
          number: 3,
          name: 'three',
        },
        {
          number: 4,
          name: 'four',
        },
      ],
    };

    const config: DeepPartial<SeederConfig> = {
      database: {
        name: DATABASE_NAME,
      },
    };
    const seeder = new Seeder(config);

    const path = `${IMPORT_DATA_DIR}/index-import`;
    const collections = seeder.readCollectionsFromPath(path, {
      transformers: [
        Seeder.Transformers.replaceDocumentIdWithUnderscoreId,
        Seeder.Transformers.setCreatedAtTimestamp,
        Seeder.Transformers.setUpdatedAtTimestamp,
      ],
    });

    await expect(seeder.import(collections)).resolves.toBeUndefined();
    await expect(database.db.listCollections().toArray()).resolves.toHaveLength(
      2,
    );

    for (const key of Object.keys(expectedDatabaseState)) {
      const collectionDocuments = await database.db
        .collection(key)
        .find()
        .toArray();

      expectedDatabaseState[key].forEach((expectedDocument) => {
        expect(collectionDocuments).toContainEqual(
          expect.objectContaining(expectedDocument),
        );
      });

      for(const document of collectionDocuments){
        expect(document).toHaveProperty('createdAt');
        expect(document).toHaveProperty('updatedAt');
      }
    }
  });

  it('should drop database before importing data', async () => {
    const expectedCollections = ['drop-db-one', 'drop-db-two'];
    const config: DeepPartial<SeederConfig> = {
      database: {
        name: DATABASE_NAME,
      },
      dropDatabase: true,
    };
    const path = `${IMPORT_DATA_DIR}/drop-db`;

    await createCollection(database.db, 'drop-db-should-be-removed');
    const seeder = new Seeder();
    const collections = seeder.readCollectionsFromPath(path);
    await expect(seeder.import(collections, config)).resolves.toBeUndefined();

    const dbCollections = await listExistingCollections(database.db);
    expect(dbCollections).toHaveLength(expectedCollections.length);
    expectedCollections.forEach((expectedCollection) => {
      expect(dbCollections).toContainEqual(expectedCollection);
    });
  });

  it('should drop collections before importing data', async () => {
    const expectedCollections = [
      'drop-col-one',
      'drop-col-two',
      'drop-col-three',
    ];
    const config: DeepPartial<SeederConfig> = {
      database: {
        name: DATABASE_NAME,
      },
      dropCollections: true,
    };

    await createCollection(database.db, expectedCollections[0]);
    await createCollection(database.db, expectedCollections[2]);

    const seeder = new Seeder();
    const path = `${IMPORT_DATA_DIR}/drop-col`;
    const collections = seeder.readCollectionsFromPath(path);
    await expect(seeder.import(collections, config)).resolves.toBeUndefined();

    const dbCollections = await listExistingCollections(database.db);
    expect(dbCollections).toHaveLength(expectedCollections.length);
    expectedCollections.forEach((expectedCollection) => {
      expect(dbCollections).toContainEqual(expectedCollection);
    });
  });

  it('should throw error when wrong path given', async () => {
    const seeder = new Seeder();
    await expect(() =>
      seeder.readCollectionsFromPath('/this/path/surely/doesnt/exist'),
    ).toThrowError('Error: ENOENT');
  });

  it('should throw error when cannot connect to database', async () => {
    const config: DeepPartial<SeederConfig> = {
      database: 'mongodb://foo:bar@localhost:27017/name',
      databaseReconnectTimeout: 1,
      mongoClientOptions: {
        useUnifiedTopology: false,
      },
    };

    const path = `${IMPORT_DATA_DIR}/index-import`;
    const seeder = new Seeder(config);
    const collections = seeder.readCollectionsFromPath(path);

    await expect(seeder.import(collections)).rejects.toThrowError('Error');
  });
});
