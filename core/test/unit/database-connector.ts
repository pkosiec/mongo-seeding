import { DatabaseConnector } from '../../src/database';
import { MongoClient, MongoClientOptions } from 'mongodb';
import { ConnectionString } from 'connection-string';

const dbConfig = new ConnectionString('', {
  protocol: 'mongodb',
  hosts: [
    {
      name: '127.0.0.1',
      port: 27017,
    },
  ],
  path: ['database'],
});

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

    await expect(
      databaseConnector.connect(dbConfig.toString()),
    ).rejects.toThrow('MongoError');
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

    expect(MongoClient).toHaveBeenCalledWith(uri, opts);
    expect(MongoClient).toHaveBeenCalledTimes(1);
    expect(connectMock).toHaveBeenCalledTimes(1);
  });
});
