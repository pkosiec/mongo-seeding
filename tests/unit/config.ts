import { getConfig, DeepPartial, AppConfig } from '../../src/config';

describe('Loading config', () => {
  it('should merge config with default one', () => {
    const partialConfig:DeepPartial<AppConfig> = {
      database: {
        port: 3000,
        host: 'mongo',
      },
      dataPath: '/',
      replaceIdWithUnderscoreId: true,
      reconnectTimeout: 100,
      supportedExtensions: ['md', 'txt'],
    };
    const config = getConfig(partialConfig);

    const expectedConfig:DeepPartial<AppConfig> = {
      database: {
        protocol: 'mongodb',
        host: 'mongo',
        port: 3000,
        name: 'database',
      },
      dataPath: '/',
      dropDatabase: false,
      replaceIdWithUnderscoreId: true,
      supportedExtensions: ['md', 'txt'],
      reconnectTimeout: 100,
    };
    expect(config).toEqual(expectedConfig);
  });
});
