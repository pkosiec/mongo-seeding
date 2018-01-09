import { DatabaseConfig } from '../src/config';
import { DatabaseConnector } from '../src/DatabaseConnector';

// Import mocks
jest.mock('../src/helpers', () => ({
  sleep: jest.fn().mockReturnValue(
    new Promise((resolve, reject) => {
      resolve();
    }),
  ),
}));
import { sleep } from '../src/helpers';
import { MongoClient } from 'mongodb';

const databaseConnector = new DatabaseConnector(MongoClient, jest.fn(() => {}));
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
        message:
          'failed to connect to server [127.0.0.1:27017] on first connect [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]',
      };
      return new Promise((resolve, reject) => reject(connectionRefusedError));
    };

    MongoClient.connect = jest
      .fn()
      .mockReturnValueOnce(getConnectionRefusedError())
      .mockReturnValueOnce(getConnectionRefusedError())
      .mockReturnValue(new Promise((resolve, reject) => resolve({})));

    const reconnectTimeout = 20;
    await databaseConnector.connect(dbConfig, reconnectTimeout);
    expect(sleep).toBeCalledWith(reconnectTimeout);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it('should throw error other than connection refused', async () => {
    MongoClient.connect = jest.fn().mockReturnValue(
      new Promise((resolve, reject) => {
        reject(new Error('MongoError'));
      }),
    );

    expect(databaseConnector.connect(dbConfig, 0)).rejects.toThrow(
      'MongoError',
    );
  });
});
