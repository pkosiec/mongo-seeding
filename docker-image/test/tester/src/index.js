const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');

let client, db;
beforeAll(async () => {
  const dbConnectionUri = process.env.DB_URI
    ? process.env.DB_URI
    : 'mongodb://127.0.0.1:27017/database';
  const databaseName = process.env.DB_NAME ? process.env.DB_NAME : 'database';
  client = await MongoClient.connect(dbConnectionUri, {
    ignoreUndefined: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = client.db(databaseName);
});

afterAll(async () => {
  await client.close(true);
});

describe('Mongo Seeding Docker Image', () => {
  it('should import objects', async () => {
    const collection = await db
      .collection('cliobjects')
      .find()
      .toArray();

    expect(collection).toHaveLength(4);

    expect(collection).toContainEqual({
      _id: 'onetest',
      number: 1,
      name: 'one',
    });
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
    expect(collection).toContainEqual(
      expect.objectContaining({
        number: 4,
        date: new Date('2012-09-27'),
      }),
    );

    const ejsonElement = collection.find(obj => obj.number === 4);
    const expectedObjectId = new ObjectId('57e193d7a9cc81b4027498b5');
    expect(expectedObjectId.equals(ejsonElement._id));
  });

  it('should import arrays', async () => {
    const collection = await db
      .collection('cliarrays')
      .find()
      .toArray();

    expect(collection).toHaveLength(6);

    expect(collection).toContainEqual({
      _id: 'onetest',
      number: 1,
      name: 'one',
    });
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
    expect(collection).toContainEqual(
      expect.objectContaining({
        number: 4,
        name: 'four',
      }),
    );
    expect(collection).toContainEqual({
      _id: 'fivetest',
      number: 5,
      name: 'five',
    });
    expect(collection).toContainEqual(
      expect.objectContaining({
        number: 6,
        name: 'six',
      }),
    );
  });
});
