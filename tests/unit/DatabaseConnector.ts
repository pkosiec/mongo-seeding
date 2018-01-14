import { MongoClient } from 'mongodb';

import { DatabaseConfig } from '../../src/config';
import { DatabaseConnector } from '../../src/DatabaseConnector';

// Import mocks
jest.mock('../../src/helpers', () => ({
  sleep: jest.fn().mockReturnValue(
    new Promise((resolve, _) => {
      resolve();
    }),
  ),
}));
import { sleep } from '../../src/helpers';
import { Database } from '../../src/Database';

const databaseConnector = new DatabaseConnector(new MongoClient());
const dbConfig: DatabaseConfig = {
  protocol: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  name: 'database',
};

describe('Connecting to database', () => {
  it('should return proper DB connection URI', () => {
    const uri = databaseConnector.getDbConnectionUri(dbConfig);
    const expectedUri = 'mongodb://127.0.0.1:27017/database';
    expect(uri).toBe(expectedUri);
  });

  it('should retry connecting to DB when connection refused', async () => {
    const getConnectionRefusedError = () => {
      const connectionRefusedError = {
        name: 'MongoNetworkError',
        message: `failed to connect to server [127.0.0.1:27017] on first connect
          [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]`,
      };
      return new Promise((_, reject) => reject(connectionRefusedError));
    };

    const result = new MongoClient();
    result.db = jest.fn().mockReturnValue({});
    MongoClient.connect = jest
      .fn()
      .mockReturnValueOnce(getConnectionRefusedError())
      .mockReturnValueOnce(getConnectionRefusedError())
      .mockReturnValue(new Promise((resolve, _) => resolve(result)));

    const reconnectTimeout = 20;
    await databaseConnector.connect(dbConfig, reconnectTimeout);
    expect(sleep).toBeCalledWith(reconnectTimeout);
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(result.db).toHaveBeenCalledTimes(1);
  });

  it('should return DB instance on success', async () => {
    MongoClient.connect = jest
      .fn()
      .mockReturnValue(
        new Promise((resolve, _) =>
          resolve(new Database(jest.genMockFromModule('mongodb'))),
        ),
      );

    const reconnectTimeout = 20;
    const result = await databaseConnector.connect(dbConfig, reconnectTimeout);
    expect(result).toBeInstanceOf(Database);
  });

  it('should throw error other than connection refused', async () => {
    MongoClient.connect = jest.fn().mockReturnValue(
      new Promise((_, reject) => {
        reject(new Error('MongoError'));
      }),
    );

    await expect(databaseConnector.connect(dbConfig, 0)).rejects.toThrow(
      'MongoError',
    );
  });
});
