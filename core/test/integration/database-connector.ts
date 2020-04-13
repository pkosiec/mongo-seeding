import { Db } from 'mongodb';
import {
  DatabaseConnector,
  Database,
  defaultDatabaseConfigObject,
} from '../../src/database';

describe('DatabaseConnector', () => {
  it('should connect to database and close connection with config object', async () => {
    const databaseConnector = new DatabaseConnector();

    const database = await databaseConnector.connect({
      ...defaultDatabaseConfigObject,
      name: 'coredb',
    });
    const collections = await database.db.listCollections().toArray();

    expect(database).toBeInstanceOf(Database);
    expect(database.db).toBeInstanceOf(Db);
    expect(collections).toBeInstanceOf(Array);

    await expect(database.closeConnection()).resolves.toBeUndefined();
  });

  it('should connect to database and close connection using URI', async () => {
    const databaseConnector = new DatabaseConnector();

    const database = await databaseConnector.connect(
      'mongodb://127.0.0.1:27017/testing',
    );
    const collections = await database.db.listCollections().toArray();

    expect(database).toBeInstanceOf(Database);
    expect(database.db).toBeInstanceOf(Db);
    expect(collections).toBeInstanceOf(Array);

    await expect(database.closeConnection()).resolves.toBeUndefined();
  });
});
