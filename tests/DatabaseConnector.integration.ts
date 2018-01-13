import { databaseConnector } from '../src/DatabaseConnector';
import { Database } from '../src/Database';
import { defaultConfig } from '../src/config';
import { Db } from 'mongodb';
jest.dontMock('mongodb');

describe('Connecting to database', () => {
  it('should connect to database', async () => {
    const database = await databaseConnector.connect(defaultConfig.database);
    expect(database).toBeInstanceOf(Database);
    expect(database).toHaveProperty("db");
    expect(database.db).toBeInstanceOf(Db);
  });

  it('should close connection with database gracefully', () => {
    expect(databaseConnector.close()).resolves.toBeUndefined();
  });

  afterAll(async () => {
    databaseConnector.close();
  });
});
