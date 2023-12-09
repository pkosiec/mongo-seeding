import { Db } from 'mongodb';
import {
  DatabaseConnector,
  Database,
  parseSeederDatabaseConfig,
} from '../../src/database';

describe('DatabaseConnector', () => {
  it('should connect to database and close connection', async () => {
    const databaseConnector = new DatabaseConnector();

    const connStr = parseSeederDatabaseConfig({ name: 'coredb' }).toString();
    const database = await databaseConnector.connect(connStr);
    const collections = await database.db.listCollections().toArray();

    expect(database).toBeInstanceOf(Database);
    expect(database.db).toBeInstanceOf(Db);
    expect(collections).toBeInstanceOf(Array);

    await expect(database.closeConnection()).resolves.toBeUndefined();
  });
});
