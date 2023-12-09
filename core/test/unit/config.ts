import { DeepPartial } from '../../src/common';
import {
  SeederConfig,
  mergeSeederConfigAndDeleteDb,
  defaultSeederConfig,
  SeederCollectionReadingOptions,
  mergeCollectionReadingOptions,
  defaultCollectionReadingOptions,
  SeederDatabaseConfig,
  mergeConnection,
} from '../../src';

describe('SeederConfig', () => {
  it('should merge config with default one', () => {
    const partialConfig: DeepPartial<SeederConfig> = {
      databaseReconnectTimeout: 20000,
    };
    const expectedConfig: Exclude<SeederConfig, 'database'> = {
      dropDatabase: false,
      dropCollections: false,
      removeAllDocuments: false,
      databaseReconnectTimeout: 20000,
    };

    const seederConfig = mergeSeederConfigAndDeleteDb(partialConfig);
    expect(seederConfig).toEqual(expectedConfig);
  });

  it('should replace undefined values with default ones', () => {
    const partialConfig: DeepPartial<SeederConfig> = {
      database: {
        name: undefined,
        port: undefined,
        host: undefined,
      },
      databaseReconnectTimeout: undefined,
    };

    const config = mergeSeederConfigAndDeleteDb(partialConfig);

    expect(config).toEqual(defaultSeederConfig);
  });

  it('should delete database property', () => {
    const partialConfig: DeepPartial<SeederConfig> = {
      database: {
        name: 'test',
        port: 3000,
        host: 'mongo',
      },
      databaseReconnectTimeout: 20000,
    };
    const expectedConfig: Exclude<SeederConfig, 'database'> = {
      dropDatabase: false,
      dropCollections: false,
      removeAllDocuments: false,
      databaseReconnectTimeout: 20000,
    };

    const config = mergeSeederConfigAndDeleteDb(partialConfig);

    expect(config).toEqual(expectedConfig);
  });
});

describe('Connection', () => {
  it('should merge config with default one', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = {
      port: 3000,
      host: 'mongo',
      username: 'test',
      password: '123',
    };
    const expectedConnectionString = 'mongodb://test:123@mongo:3000/database';

    const connection = mergeConnection(partialConfig);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should replace config with a new object', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = {
      host: 'newhost',
      username: 'newuser',
      password: 'newpass',
      name: 'newdb',
    };
    const oldConn: DeepPartial<SeederDatabaseConfig> = {
      host: 'oldhost',
      port: 3000,
      username: 'olduser',
      password: 'oldpass',
      name: 'olddb',
    };
    const expectedConnectionString =
      'mongodb://newuser:newpass@newhost:3000/newdb';

    const connection1 = mergeConnection(oldConn);
    const connection = mergeConnection(partialConfig, connection1);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should update previous URI config with a new object', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = {
      username: 'newuser',
      name: 'newdb',
    };
    const oldConn = 'mongodb://foo:bar@aaa:3000/olddb';
    const expectedConnectionString = 'mongodb://newuser:bar@aaa:3000/newdb';

    const prevConnection = mergeConnection(oldConn);
    const connection = mergeConnection(partialConfig, prevConnection);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should replace config with a new URI', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> =
      'mongodb://bbbb:3000/newdb';
    const oldConn: DeepPartial<SeederDatabaseConfig> = {
      host: 'aaaa',
      port: 3000,
      username: 'olduser',
      password: 'oldpass',
      name: 'olddb',
    };
    const expectedConnectionString = 'mongodb://bbbb:3000/newdb';

    const connection1 = mergeConnection(oldConn);
    const connection = mergeConnection(partialConfig, connection1);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should replace undefined values with default ones', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = {};
    const expectedConnectionString = 'mongodb://127.0.0.1:27017/database';

    const connection = mergeConnection(partialConfig);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should override default database config object with connection URI', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = 'myhost:3233';
    const expectedConnectionString = 'mongodb://myhost:3233/database';

    const connection = mergeConnection(partialConfig);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should return valid DB connection URI with Mongo 3.6 protocol', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = {
      protocol: 'mongodb+srv',
      host: '127.0.0.1',
      port: 27017,
      name: 'database',
    };
    const expectedConnectionString = 'mongodb+srv://127.0.0.1:27017/database';

    const connection = mergeConnection(partialConfig);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should return valid DB connection URI with username only', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = {
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
    const expectedConnectionString =
      'mongodb://user@10.10.10.1:27017/authDb?ssl=false&foo=bar';

    const connection = mergeConnection(partialConfig);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should return valid DB connection URI with username and login', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = {
      protocol: 'mongodb',
      username: 'user',
      password: 'pass',
      host: '10.10.10.1',
      port: 27017,
      name: 'mydb',
      options: {
        foo: 'bar',
      },
    };
    const expectedConnectionString =
      'mongodb://user:pass@10.10.10.1:27017/mydb?foo=bar';

    const connection = mergeConnection(partialConfig);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });

  it('should return valid escaped DB connection URI with username and login', () => {
    const partialConfig: DeepPartial<SeederDatabaseConfig> = {
      protocol: 'mongodb',
      username: 'user',
      password: 'my#pass?test',
      host: '10.10.10.1',
      port: 27017,
      name: 'mydb',
      options: {
        foo: 'bar',
      },
    };
    const expectedConnectionString =
      'mongodb://user:my%23pass%3Ftest@10.10.10.1:27017/mydb?foo=bar';

    const connection = mergeConnection(partialConfig);
    expect(connection.toString()).toEqual(expectedConnectionString);
  });
});

describe('SeederCollectionReadingOptions', () => {
  it('should merge options with default ones', () => {
    const partialOptions: DeepPartial<SeederCollectionReadingOptions> = {
      extensions: [],
    };
    const expectedOptions: SeederCollectionReadingOptions = {
      extensions: ['json', 'js', 'cjs'],
      transformers: [],
      ejsonParseOptions: {
        relaxed: true,
      },
    };

    const options = mergeCollectionReadingOptions(partialOptions);

    expect(options).toEqual(expectedOptions);
  });

  it('should replace undefined values with default ones', () => {
    const partialOptions: DeepPartial<SeederCollectionReadingOptions> = {
      extensions: undefined,
      transformers: undefined,
    };

    const options = mergeCollectionReadingOptions(partialOptions);

    expect(options).toEqual(defaultCollectionReadingOptions);
  });
});
