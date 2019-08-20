import {
  createConfigFromOptions,
  convertEmptyObjectToUndefined,
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
          'db-uri': 'cmdUri',
          'reconnect-timeout': 7000,
          'drop-database': true,
          'drop-collections': true,
          'transpile-only': true,
        },
        expected: {
          database: 'cmdUri',
          databaseReconnectTimeout: 7000,
          dropDatabase: true,
          dropCollections: true,
          transpileOnly: true,
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
          transpileOnly: false,
          silent: true,
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
      {
        input: {
          'db-host': 'testHost',
          'db-port': 3232,
          'db-name': 'testName',
          'db-options': 'foo=bar;',
        },
        expected: {
          database: {
            host: 'testHost',
            port: 3232,
            options: {
              foo: 'bar',
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
        },
        expected: {
          database: {
            host: 'testHost',
            port: 3232,
            options: {
              foo: 'bar',
            },
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
          database: 'cmdUri',
          databaseReconnectTimeout: 7000,
          dropDatabase: true,
          dropCollections: true,
          transpileOnly: true,
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
          transpileOnly: false,
          silent: true,
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
      {
        input: {
          DB_HOST: 'testHost',
          DB_PORT: '3232',
          DB_NAME: 'testName',
          DB_OPTIONS: 'foo=bar;',
        },
        expected: {
          database: {
            host: 'testHost',
            port: 3232,
            options: {
              foo: 'bar',
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
        },
        expected: {
          database: {
            host: 'testHost',
            port: 3232,
            options: {
              foo: 'bar',
            },
          },
        },
      },
    ];

    for (const testCase of testCases) {
      Object.keys(testCase.input).forEach(key => {
        process.env[key] = testCase.input[key];
      });

      const result = createConfigFromOptions({});
      expect(result).toMatchObject(testCase.expected);

      process.env = previousEnvs;
    }
  });

  it('should overwrite environmental variables with command line arguments', () => {
    process.env.DB_URI = 'envUri';
    process.env.RECONNECT_TIMEOUT = '5000';
    process.env.DROP_DATABASE = 'true';

    const cmdArgs: CommandLineArguments = {
      'db-uri': 'cmdUri',
      'reconnect-timeout': 7000,
    };

    const result = createConfigFromOptions(cmdArgs);

    expect(result).toMatchObject({
      database: 'cmdUri',
      databaseReconnectTimeout: 7000,
      dropDatabase: true,
    });
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
