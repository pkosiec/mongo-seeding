import { Db } from 'mongodb';

import { DatabaseConnector, Database } from '../../src/database';
import { defaultConfig } from '../../src/common';

describe('DatabaseConnector', () => {
  it('should connect to database and close connection with config object', async () => {
    const databaseConnector = new DatabaseConnector();

    const database = await databaseConnector.connect({
      databaseConfig: {
        ...defaultConfig.database,
        name: 'coredb',
      },
    });
    const collections = await database.db.listCollections().toArray();

    expect(database).toBeInstanceOf(Database);
    expect(database.db).toBeInstanceOf(Db);
    expect(collections).toBeInstanceOf(Array);

    await expect(databaseConnector.close()).resolves.toBeUndefined();
  });

  it('should connect to database and close connection using URI', async () => {
    const databaseConnector = new DatabaseConnector();

    const database = await databaseConnector.connect({
      databaseConnectionUri: 'mongodb://127.0.0.1:27017/testing',
    });
    const collections = await database.db.listCollections().toArray();

    expect(database).toBeInstanceOf(Database);
    expect(database.db).toBeInstanceOf(Db);
    expect(collections).toBeInstanceOf(Array);

    await expect(databaseConnector.close()).resolves.toBeUndefined();
  });
});
