import { MongoClient } from 'mongodb';

import { DatabaseConnector, sleep, Database } from '../../src/database';
import { DatabaseConfig } from '../../src/common';

// Import mocks
jest.mock('../../src/database/timeUtils', () => ({
  sleep: jest.fn().mockReturnValue(
    new Promise((resolve, _) => {
      resolve();
    }),
  ),
  checkTimeoutExpired: jest
    .fn()
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(false)
    .mockReturnValue(true),
}));

const databaseConnector = new DatabaseConnector(new MongoClient());
const dbConfig: DatabaseConfig = {
  protocol: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  name: 'database',
};

describe('DatabaseConnector', () => {
  it('should return valid DB connection URI', () => {
    const expectedUri = 'mongodb://127.0.0.1:27017/database';
    const uri = databaseConnector.getDbConnectionUri(dbConfig);
    expect(uri).toBe(expectedUri);
  });

  it('should return valid DB connection URI with username only', () => {
    const authConfig: DatabaseConfig = {
      protocol: 'mongodb',
      username: 'user',
      host: '10.10.10.1',
      port: 27017,
      name: 'authDb',
    };
    const expectedUri = 'mongodb://user@10.10.10.1:27017/authDb';
    const uri = databaseConnector.getDbConnectionUri(authConfig);
    expect(uri).toBe(expectedUri);
  });

  it('should return valid DB connection URI with username and login', () => {
    const authConfig: DatabaseConfig = {
      protocol: 'mongodb',
      username: 'user',
      password: 'pass',
      host: '10.10.10.1',
      port: 27017,
      name: 'authDb',
    };
    const uri = databaseConnector.getDbConnectionUri(authConfig);
    const expectedUri = 'mongodb://user:pass@10.10.10.1:27017/authDb';
    expect(uri).toBe(expectedUri);
  });

  it('should retry connecting to DB within given time limit', async () => {
    const getConnectionRefusedError = () => {
      const connectionRefusedError = {
        name: 'MongoNetworkError',
        message: `failed to connect to server [127.0.0.1:27017] on first connect
          [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]`,
      };
      return new Promise((_, reject) => reject(connectionRefusedError));
    };

    const result = new Database(jest.genMockFromModule('mongodb'));
    (result.db as any) = jest.fn().mockReturnValue({});
    MongoClient.connect = jest
      .fn()
      .mockReturnValueOnce(getConnectionRefusedError())
      .mockReturnValueOnce(getConnectionRefusedError())
      .mockReturnValue(new Promise((resolve, _) => resolve(result)));

    const reconnectTimeoutInSeconds = 2;
    await databaseConnector.connect(dbConfig, reconnectTimeoutInSeconds);
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(result.db).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Database);
  });

  it('should fail after given connection timeout', async () => {
    MongoClient.connect = jest.fn().mockReturnValue(
      new Promise((_, reject) => {
        reject(new Error('MongoError'));
      }),
    );

    const reconnectTimeoutInSeconds = 3;
    await expect(
      databaseConnector.connect(dbConfig, reconnectTimeoutInSeconds),
    ).rejects.toThrow('Timeout');
    expect(sleep).toHaveBeenCalledTimes(3);
  });
});
