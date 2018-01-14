import { getConfig } from '../../src/config';

describe('Loading config', () => {
  it('should merge config with default one', () => {
    const partialConfig = {
      database: {
        port: 3000,
        host: 'mongo',
      },
      dataPath: '/',
      convertId: true,
      reconnectTimeout: 100,
      supportedExtensions: ['md', 'txt'],
    };
    const config = getConfig(partialConfig);

    const expectedConfig = {
      database: {
        protocol: 'mongodb',
        host: 'mongo',
        port: 3000,
        name: 'database',
      },
      dataPath: '/',
      dropDatabase: false,
      convertId: true,
      supportedExtensions: ['md', 'txt'],
      reconnectTimeout: 100,
    };
    expect(config).toEqual(expectedConfig);
  });
});
