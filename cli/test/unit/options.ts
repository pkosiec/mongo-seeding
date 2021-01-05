import { Seeder } from 'mongo-seeding';
import {
  createConfigFromOptions,
  convertEmptyObjectToUndefined,
  DEFAULT_EXTENSIONS,
} from '../../src/options';
import { CommandLineArguments, PartialCliOptions } from '../../src/types';

describe('Options', () => {
  const previousEnvs = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...previousEnvs };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = previousEnvs;
  });

  it('should create config from command line arguments', () => {
    const testCases: Array<{
      input: CommandLineArguments;
      expected: PartialCliOptions;
    }> = [
      {
        input: {
          data: './foo/bar',
          'db-uri': 'cmdUri',
          'reconnect-timeout': 7000,
          'drop-database': true,
          'drop-collections': true,
          'transpile-only': true,
          'ejson-parse-canonical-mode': true,
        },
        expected: {
          seeder: {
            database: 'cmdUri',
            databaseReconnectTimeout: 7000,
            dropDatabase: true,
            dropCollections: true,
          },
          cli: {
            dataPath: './foo/bar',
            transpileOnly: true,
            ejsonParseCanonicalMode: true,
          },
          collectionReading: {
            ejsonParseOptions: {
              relaxed: false,
            },
            extensions: DEFAULT_EXTENSIONS,
            transformers: [],
          },
        },
      },
      {
        input: {
          'db-protocol': 'testing://',
          'db-host': 'testHost',
          'db-port': 3232,
          'db-name': 'testName',
          'db-username': 'testUserName',
          'db-password': 'testPasswd',
          silent: true,
        },
        expected: {
          seeder: {
            database: {
              protocol: 'testing://',
              host: 'testHost',
              port: 3232,
              name: 'testName',
              username: 'testUserName',
              password: 'testPasswd',
            },
            dropDatabase: false,
            dropCollections: false,
          },
          cli: {
            dataPath: './',
            transpileOnly: false,
            ejsonParseCanonicalMode: false,
            silent: true,
          },
          collectionReading: {
            ejsonParseOptions: {
              relaxed: true,
            },
            extensions: DEFAULT_EXTENSIONS,
            transformers: [],
          },
        },
      },
      {
        input: {
          'db-host': 'testHost',
          'db-port': 3232,
          'db-name': 'testName',
          'db-options': 'foo=bar;test=testValue',
        },
        expected: {
          seeder: {
            database: {
              host: 'testHost',
              port: 3232,
              options: {
                foo: 'bar',
                test: 'testValue',
              },
            },
          },
        },
      },
      {
        input: {
          'db-host': 'testHost',
          'db-port': 3232,
          'db-name': 'testName',
          'db-options': 'foo=bar;',
        },
        expected: {
          seeder: {
            database: {
              host: 'testHost',
              port: 3232,
              options: {
                foo: 'bar',
              },
            },
          },
        },
      },
      {
        input: {
          'db-host': 'testHost',
          'db-port': 3232,
          'db-name': 'testName',
          'db-options': 'foo=bar',
          'set-timestamps': true,
          'replace-id': true,
        },
        expected: {
          seeder: {
            database: {
              host: 'testHost',
              port: 3232,
              options: {
                foo: 'bar',
              },
            },
          },
          collectionReading: {
            transformers: [
              Seeder.Transformers.replaceDocumentIdWithUnderscoreId,
              Seeder.Transformers.setCreatedAtTimestamp,
              Seeder.Transformers.setUpdatedAtTimestamp,
            ],
          },
        },
      },
    ];

    for (const testCase of testCases) {
      const result = createConfigFromOptions(testCase.input);
      expect(result).toMatchObject(testCase.expected);
    }
  });

  it('should read options from environmental variables', () => {
    interface Envs {
      [key: string]: string;
    }
    const testCases: Array<{
      input: Envs;
      expected: PartialCliOptions;
    }> = [
      {
        input: {
          DB_URI: 'cmdUri',
          RECONNECT_TIMEOUT: '7000',
          DROP_DATABASE: 'true',
          DROP_COLLECTIONS: 'true',
          TRANSPILE_ONLY: 'true',
        },
        expected: {
          seeder: {
            database: 'cmdUri',
            databaseReconnectTimeout: 7000,
            dropDatabase: true,
            dropCollections: true,
          },
          cli: {
            transpileOnly: true,
          },
        },
      },
      {
        input: {
          DB_PROTOCOL: 'testing://',
          DB_HOST: 'testHost',
          DB_PORT: '3232',
          DB_NAME: 'testName',
          DB_USERNAME: 'testUserName',
          DB_PASSWORD: 'testPasswd',
          SILENT: 'true',
        },
        expected: {
          seeder: {
            database: {
              protocol: 'testing://',
              host: 'testHost',
              port: 3232,
              name: 'testName',
              username: 'testUserName',
              password: 'testPasswd',
            },
            dropDatabase: false,
            dropCollections: false,
          },
          cli: {
            transpileOnly: false,
            silent: true,
          },
        },
      },
      {
        input: {
          DB_HOST: 'testHost',
          DB_PORT: '3232',
          DB_NAME: 'testName',
          DB_OPTIONS: 'foo=bar;test=testValue',
        },
        expected: {
          seeder: {
            database: {
              host: 'testHost',
              port: 3232,
              options: {
                foo: 'bar',
                test: 'testValue',
              },
            },
          },
        },
      },
      {
        input: {
          DB_HOST: 'testHost',
          DB_PORT: '3232',
          DB_NAME: 'testName',
          DB_OPTIONS: 'foo=bar;',
        },
        expected: {
          seeder: {
            database: {
              host: 'testHost',
              port: 3232,
              options: {
                foo: 'bar',
              },
            },
          },
        },
      },
      {
        input: {
          DB_HOST: 'testHost',
          DB_PORT: '3232',
          DB_NAME: 'testName',
          DB_OPTIONS: 'foo=bar',
          EJSON_PARSE_CANONICAL_MODE: 'true',
          SET_TIMESTAMPS: 'true',
          REPLACE_ID: 'true',
        },
        expected: {
          seeder: {
            database: {
              host: 'testHost',
              port: 3232,
              options: {
                foo: 'bar',
              },
            },
          },
          cli: {
            dataPath: './',
            ejsonParseCanonicalMode: true,
            setTimestamps: true,
            replaceId: true,
          },
          collectionReading: {
            ejsonParseOptions: {
              relaxed: false,
            },
            transformers: [
              Seeder.Transformers.replaceDocumentIdWithUnderscoreId,
              Seeder.Transformers.setCreatedAtTimestamp,
              Seeder.Transformers.setUpdatedAtTimestamp,
            ],
          },
        },
      },
    ];

    for (const testCase of testCases) {
      Object.keys(testCase.input).forEach((key) => {
        process.env[key] = testCase.input[key];
      });

      const result = createConfigFromOptions({});
      expect(result).toMatchObject(testCase.expected);

      process.env = { ...previousEnvs };
    }
  });

  it('should overwrite environmental variables with command line arguments', () => {
    process.env.DB_URI = 'envUri';
    process.env.RECONNECT_TIMEOUT = '5000';
    process.env.DROP_DATABASE = 'true';
    process.env.REPLACE_ID = 'true';

    const cmdArgs: CommandLineArguments = {
      'db-uri': 'cmdUri',
      'reconnect-timeout': 7000,
      'replace-id': false,
    };

    const result = createConfigFromOptions(cmdArgs);

    expect(result).toMatchObject({
      seeder: {
        database: 'cmdUri',
        databaseReconnectTimeout: 7000,
        dropDatabase: true,
      },
      cli: {
        ejsonParseCanonicalMode: false,
        dataPath: './',
      },
      collectionReading: {
        extensions: DEFAULT_EXTENSIONS,
        ejsonParseOptions: {
          relaxed: true,
        },
      },
    } as PartialCliOptions);
  });

  it('should convert empty object to undefined', () => {
    const testCases: Array<{ input: any; expectedResult: any }> = [
      {
        input: {},
        expectedResult: undefined,
      },
      {
        input: {
          test: undefined,
          testKey: undefined,
        },
        expectedResult: undefined,
      },
      {
        input: {
          test: 'test',
          testKey: undefined,
        },
        expectedResult: {
          test: 'test',
          testKey: undefined,
        },
      },
    ];

    for (const testCase of testCases) {
      const result = convertEmptyObjectToUndefined(testCase.input);
      expect(result).toEqual(testCase.expectedResult);
    }
  });
});
