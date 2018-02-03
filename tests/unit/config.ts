import {
  getConfig,
  DeepPartial,
  AppConfig,
  defaultConfig,
} from '../../src/config';

describe('Loading config', () => {
  it('should merge config with default one', () => {
    const partialConfig: DeepPartial<AppConfig> = {
      database: {
        port: 3000,
        host: 'mongo',
        username: 'test',
        password: '123',
      },
      dataPath: '/',
      replaceIdWithUnderscoreId: true,
      reconnectTimeout: 100,
      supportedExtensions: ['md', 'txt'],
    };
    const config = getConfig(partialConfig);

    const expectedConfig: DeepPartial<AppConfig> = {
      database: {
        protocol: 'mongodb',
        host: 'mongo',
        port: 3000,
        name: 'database',
        username: 'test',
        password: '123',
      },
      dataPath: '/',
      dropDatabase: false,
      replaceIdWithUnderscoreId: true,
      supportedExtensions: ['md', 'txt'],
      reconnectTimeout: 100,
    };
    expect(config).toEqual(expectedConfig);
  });

  it('should replace undefined values with default ones', () => {
    const partialConfig: DeepPartial<AppConfig> = {
      database: {
        name: undefined,
        port: undefined,
        host: undefined,
      },
      replaceIdWithUnderscoreId: undefined,
      reconnectTimeout: undefined,
    };
    const config = getConfig(partialConfig);
    expect(config).toEqual(defaultConfig);
  });
});
