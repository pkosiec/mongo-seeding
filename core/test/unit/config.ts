import { DeepPartial } from '../../src/common';
import {
  SeederConfig,
  mergeSeederConfig,
  defaultSeederConfig,
  SeederCollectionReadingOptions,
  mergeCollectionReadingOptions,
  defaultCollectionReadingOptions,
} from '../../src';

describe('SeederConfig', () => {
  it('should merge config with default one', () => {
    const partialConfig: DeepPartial<SeederConfig> = {
      database: {
        port: 3000,
        host: 'mongo',
        username: 'test',
        password: '123',
      },
      databaseReconnectTimeout: 20000,
    };
    const expectedConfig: SeederConfig = {
      database: {
        protocol: 'mongodb',
        host: 'mongo',
        port: 3000,
        name: 'database',
        username: 'test',
        password: '123',
      },
      dropDatabase: false,
      dropCollections: false,
      removeAllDocuments: false,
      databaseReconnectTimeout: 20000,
    };

    const config = mergeSeederConfig(partialConfig);

    expect(config).toEqual(expectedConfig);
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

    const config = mergeSeederConfig(partialConfig);

    expect(config).toEqual(defaultSeederConfig);
  });

  it('should override default database config object with connection URI', () => {
    const partialConfig: DeepPartial<SeederConfig> = {
      database: 'testURI',
      databaseReconnectTimeout: undefined,
    };

    const config = mergeSeederConfig(partialConfig);

    expect(config).toHaveProperty('database', 'testURI');
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
