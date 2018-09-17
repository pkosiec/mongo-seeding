const MongoClient = require('mongodb').MongoClient;

let client, db;
beforeAll(async () => {
  const dbConnectionUri = process.env.DB_URI
    ? process.env.DB_URI
    : 'mongodb://127.0.0.1:27017/database';
  const databaseName = process.env.DB_NAME ? process.env.DB_NAME : 'database';
  client = await MongoClient.connect(
    dbConnectionUri,
    { ignoreUndefined: true, useNewUrlParser: true },
  );
  db = client.db(databaseName);
});

afterAll(async () => {
  await client.close(true);
});

describe('Mongo Seeding Docker Image', () => {
  it('should import sample data', async () => {
    const testCases = [
      {
        collectionName: 'cliobjects',
        expectedLength: 3,
      },
      {
        collectionName: 'cliarrays',
        expectedLength: 6,
      },
    ];

    for (const testCase of testCases) {
      const collection = await db
        .collection(testCase.collectionName)
        .find()
        .toArray();

      expect(collection).toHaveLength(testCase.expectedLength);

      expect(collection).toContainEqual(
        expect.objectContaining({
          _id: 'onetest',
          number: 1,
          name: 'one',
        }),
      );
      expect(collection).toContainEqual(
        expect.objectContaining({
          number: 2,
          name: 'two',
        }),
      );
      expect(collection).toContainEqual({
        _id: 'threetest',
        number: 3,
        name: 'three',
      });
    }
  });
});
