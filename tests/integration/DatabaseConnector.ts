import { Db, MongoClient } from 'mongodb';

import { defaultConfig } from '../../src/config';
import { DatabaseConnector } from '../../src/DatabaseConnector';
import { Database } from '../../src/Database';

describe('Connecting to database', () => {
  it('should connect to database and close connection', async () => {
    const databaseConnector = new DatabaseConnector(new MongoClient());
    const database = await databaseConnector.connect(defaultConfig.database);

    expect(database).toBeInstanceOf(Database);
    expect(database.db).toBeInstanceOf(Db);

    const collections = await database.db.listCollections().toArray();
    expect(collections).toBeInstanceOf(Array);

    await expect(databaseConnector.close()).resolves.toBeUndefined();
  });
});
