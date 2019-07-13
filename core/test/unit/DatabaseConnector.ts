import { MongoClient } from 'mongodb';

import {
  DatabaseConnector,
  sleep,
  Database,
  SeederDatabaseConfig,
  SeederDatabaseConfigObjectOptions,
} from '../../src/database';

// Import mocks
jest.mock('../../src/database/time', () => ({
  sleep: jest.fn().mockReturnValue(
    new Promise((resolve, _) => {
      resolve();
    }),
  ),
  checkTimeout: jest
    .fn()
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(false)
    .mockReturnValue(true),
}));

const databaseConnector = new DatabaseConnector();
const dbConfig: SeederDatabaseConfig = {
  protocol: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  name: 'database',
};

describe('DatabaseConnector', () => {
  it('should throw error when trying connecting without config', async () => {
    // @ts-ignore
    await expect(databaseConnector.connect({})).rejects.toThrow();
  });

  it('should return valid DB connection URI', () => {
    const expectedUri = 'mongodb://127.0.0.1:27017/database';
    const uri = databaseConnector.getDbConnectionUri(dbConfig);
    expect(uri).toBe(expectedUri);
  });

  it('should return valid DB connection URI with Mongo 3.6 protocol', () => {
    const dbConfig: SeederDatabaseConfig = {
      protocol: 'mongodb+srv',
      host: '127.0.0.1',
      port: 27017,
      name: 'database',
    };
    const expectedUri = 'mongodb+srv://127.0.0.1/database';
    const uri = databaseConnector.getDbConnectionUri(dbConfig);
    expect(uri).toBe(expectedUri);
  });

  it('should return valid DB connection URI with username only', () => {
    const authConfig: SeederDatabaseConfig = {
      protocol: 'mongodb',
      username: 'user',
      host: '10.10.10.1',
      port: 27017,
      name: 'authDb',
      options: {
        ssl: 'false',
      },
    };
    const expectedUri = 'mongodb://user@10.10.10.1:27017/authDb?ssl=false';
    const uri = databaseConnector.getDbConnectionUri(authConfig);
    expect(uri).toBe(expectedUri);
  });

  it('should return valid DB connection URI with username and login', () => {
    const authConfig: SeederDatabaseConfig = {
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

  it('should return valid database name from URI', () => {
    interface Test {
      url: string;
      expectedDbName: string;
    }

    const tests: Test[] = [
      {
        url: 'mongodb://user@10.10.10.1:27017/dbName',
        expectedDbName: 'dbName',
      },
      {
        url: 'mongodb://user@10.10.10.1:27017/dbName?retryWrites=true',
        expectedDbName: 'dbName',
      },
      {
        url:
          'mongodb://user@10.10.10.1:27017/dbName?retryWrites=true&something=false',
        expectedDbName: 'dbName',
      },
      {
        url: 'mongodb://user@10.10.10.1:27017/?retryWrites=true',
        expectedDbName: 'admin',
      },
      {
        url: 'mongodb://user@10.10.10.1:27017',
        expectedDbName: 'admin',
      },
      {
        url: 'mongodb://10.10.10.1',
        expectedDbName: 'admin',
      },
    ];

    for (const { url, expectedDbName } of tests) {
      const dbName = databaseConnector.getDbName(url);
      expect(dbName).toEqual(expectedDbName);
    }
  });

  it('should mask user credentials in database connection URI', () => {
    interface Test {
      uri: string;
      expectedMaskedUri: string;
    }

    const tests: Test[] = [
      {
        uri: 'mongodb://user@10.10.10.1:27017/dbName',
        expectedMaskedUri: 'mongodb://[secure]@10.10.10.1:27017/dbName',
      },
      {
        uri: 'mongodb://user:pass@foo.bar:27017/dbName?retryWrites=true',
        expectedMaskedUri:
          'mongodb://[secure]@foo.bar:27017/dbName?retryWrites=true',
      },
      {
        uri:
          'mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/admin?replicaSet=myRepl',
        expectedMaskedUri:
          'mongodb://[secure]@mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/admin?replicaSet=myRepl',
      },
      {
        uri:
          'mongodb://10.10.10.1:27017/dbName?retryWrites=true&something=false',
        expectedMaskedUri:
          'mongodb://10.10.10.1:27017/dbName?retryWrites=true&something=false',
      },
    ];

    for (const { uri, expectedMaskedUri } of tests) {
      const maskedUri = databaseConnector.maskUriCredentials(uri);
      expect(maskedUri).toEqual(expectedMaskedUri);
    }
  });

  it('should convert Database Config Object URI to valid options URI part', () => {
    interface Test {
      options: SeederDatabaseConfigObjectOptions;
      expectedUriPart: string;
    }

    const tests: Test[] = [
      {
        options: {
          foo: 'bar',
        },
        expectedUriPart: '?foo=bar',
      },
      {
        options: {
          foo: 'bar',
          ssl: 'true',
        },
        expectedUriPart: '?foo=bar&ssl=true',
      },
      {
        options: {
          foo: 'bar',
          ssl: 'false',
          baz: 'bar',
        },
        expectedUriPart: '?foo=bar&ssl=false&baz=bar',
      },
      {
        options: {},
        expectedUriPart: '',
      },
    ];

    for (const { options, expectedUriPart } of tests) {
      const uriPart = databaseConnector.getOptionsUriPart(options);
      expect(uriPart).toEqual(expectedUriPart);
    }
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

    await databaseConnector.connect(dbConfig);
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

    await expect(databaseConnector.connect(dbConfig)).rejects.toThrowError(
      'Timeout',
    );
    expect(sleep).toHaveBeenCalledTimes(2);
  });
});
