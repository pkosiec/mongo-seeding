import { DatabaseConnector, SeederDatabaseConfig } from '../../src/database';
import { MongoClient, MongoClientOptions } from 'mongodb';

const dbConfig: SeederDatabaseConfig = {
  protocol: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  name: 'database',
};

const uri = 'mongodb://foo.bar';

const connectMock = jest.fn();

jest.mock('mongodb', () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => {
      return { connect: connectMock, db: jest.fn() };
    }),
  };
});

describe('DatabaseConnector', () => {
  beforeEach(() => {
    //@ts-ignore
    MongoClient.mockClear();
    connectMock.mockClear();
  });

  it('should throw error when trying connecting without config', async () => {
    const databaseConnector = new DatabaseConnector();
    // @ts-ignore
    await expect(databaseConnector.connect({})).rejects.toThrow();
  });

  it('should return valid DB connection URI', () => {
    const databaseConnector = new DatabaseConnector();

    const expectedUri = 'mongodb://127.0.0.1:27017/database';
    // @ts-ignore
    const uri = databaseConnector.getDbConnectionUri(dbConfig);
    expect(uri).toBe(expectedUri);
  });

  it('should return valid DB connection URI with Mongo 3.6 protocol', () => {
    const databaseConnector = new DatabaseConnector();
    const dbConfig: SeederDatabaseConfig = {
      protocol: 'mongodb+srv',
      host: '127.0.0.1',
      port: 27017,
      name: 'database',
    };
    const expectedUri = 'mongodb+srv://127.0.0.1/database';
    // @ts-ignore
    const uri = databaseConnector.getDbConnectionUri(dbConfig);
    expect(uri).toBe(expectedUri);
  });

  it('should return valid DB connection URI with username only', () => {
    const databaseConnector = new DatabaseConnector();
    const authConfig: SeederDatabaseConfig = {
      protocol: 'mongodb',
      username: 'user',
      host: '10.10.10.1',
      port: 27017,
      name: 'authDb',
      options: {
        ssl: 'false',
        foo: 'bar',
      },
    };
    const expectedUri =
      'mongodb://user@10.10.10.1:27017/authDb?ssl=false&foo=bar';
    // @ts-ignore
    const uri = databaseConnector.getDbConnectionUri(authConfig);
    expect(uri).toBe(expectedUri);
  });

  it('should return valid DB connection URI with username and login', () => {
    const databaseConnector = new DatabaseConnector();
    const authConfig: SeederDatabaseConfig = {
      protocol: 'mongodb',
      username: 'user',
      password: 'pass',
      host: '10.10.10.1',
      port: 27017,
      name: 'authDb',
    };
    // @ts-ignore
    const uri = databaseConnector.getDbConnectionUri(authConfig);
    const expectedUri = 'mongodb://user:pass@10.10.10.1:27017/authDb';
    expect(uri).toBe(expectedUri);
  });

  it('should mask user credentials in database connection URI', () => {
    const databaseConnector = new DatabaseConnector();

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
        uri: 'mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/admin?replicaSet=myRepl',
        expectedMaskedUri:
          'mongodb://[secure]@mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/admin?replicaSet=myRepl',
      },
      {
        uri: 'mongodb://10.10.10.1:27017/dbName?retryWrites=true&something=false',
        expectedMaskedUri:
          'mongodb://10.10.10.1:27017/dbName?retryWrites=true&something=false',
      },
    ];

    for (const { uri, expectedMaskedUri } of tests) {
      // @ts-ignore
      const maskedUri = databaseConnector.maskUriCredentials(uri);
      expect(maskedUri).toEqual(expectedMaskedUri);
    }
  });

  it('should fail when connect fails', async () => {
    const databaseConnector = new DatabaseConnector();

    connectMock.mockReturnValue(
      new Promise((_, reject) => {
        reject(new Error('MongoError'));
      }),
    );

    await expect(databaseConnector.connect(dbConfig)).rejects.toThrowError(
      'MongoError',
    );
  });

  it('should allow passing custom Mongo client options', async () => {
    connectMock.mockReturnValue(
      new Promise<void>((resolve) => {
        resolve();
      }),
    );

    const opts: MongoClientOptions = {
      maxPoolSize: 3,
      minPoolSize: 1,
    };

    const connector = new DatabaseConnector(3000, opts);

    await connector.connect(uri);

    expect(MongoClient).toBeCalledWith(uri, opts);
    expect(MongoClient).toBeCalledTimes(1);
    expect(connectMock).toBeCalledTimes(1);
  });
});
