import {
  createConfigFromOptions,
  convertEmptyObjectToUndefined,
} from '../../src/options';
import { CommandLineArguments } from '../../src/types';

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
    const cmdArgs: CommandLineArguments = {
      'db-uri': 'cmdUri',
      'reconnect-timeout': 7000,
    };

    const result = createConfigFromOptions(cmdArgs);

    expect(result).toHaveProperty('database', 'cmdUri');
    expect(result).toHaveProperty('databaseReconnectTimeout', 7000);

    expect(result).toMatchObject({
      database: 'cmdUri',
      databaseReconnectTimeout: 7000,
    });
  });

  it('should read options from environmental variables', () => {
    process.env.DB_URI = 'envUri';
    process.env.RECONNECT_TIMEOUT = '5000';
    process.env.DROP_DATABASE = 'true';

    const result = createConfigFromOptions({});

    expect(result).toMatchObject({
      database: 'envUri',
      databaseReconnectTimeout: 5000,
      dropDatabase: true,
    });
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
