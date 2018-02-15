import { Db, MongoClient } from 'mongodb';

import { DatabaseConnector, Database } from '../../src/database';
import { defaultConfig } from '../../src/common';

describe('DatabaseConnector', () => {
  it('should connect to database and close connection', async () => {
    const databaseConnector = new DatabaseConnector(new MongoClient());

    const database = await databaseConnector.connect(
      defaultConfig.database,
      10,
    );
    const collections = await database.db.listCollections().toArray();

    expect(database).toBeInstanceOf(Database);
    expect(database.db).toBeInstanceOf(Db);
    expect(collections).toBeInstanceOf(Array);

    await expect(databaseConnector.close()).resolves.toBeUndefined();
  });
});
