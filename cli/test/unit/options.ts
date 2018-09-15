import { createConfigFromOptions } from '../../src/options';
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
      'reconnect-timeout': 7,
    };

    const result = createConfigFromOptions(cmdArgs);

    expect(result).toHaveProperty('databaseConnectionUri', 'cmdUri');
    expect(result).toHaveProperty('reconnectTimeoutInSeconds', 7);

    expect(result).toMatchObject({
      databaseConnectionUri: 'cmdUri',
      reconnectTimeoutInSeconds: 7,
    });
  });

  it('should read options from environmental variables', () => {
    process.env.DB_URI = 'envUri';
    process.env.RECONNECT_TIMEOUT = '5';
    process.env.DROP_DATABASE = 'true';

    const result = createConfigFromOptions({});

    expect(result).toMatchObject({
      databaseConnectionUri: 'envUri',
      reconnectTimeoutInSeconds: 5,
      dropDatabase: true,
    });
  });

  it('should overwrite environmental variables with command line arguments', () => {
    process.env.DB_URI = 'envUri';
    process.env.RECONNECT_TIMEOUT = '5';
    process.env.DROP_DATABASE = 'true';

    const cmdArgs: CommandLineArguments = {
      'db-uri': 'cmdUri',
      'reconnect-timeout': 7,
    };

    const result = createConfigFromOptions(cmdArgs);

    expect(result).toMatchObject({
      databaseConnectionUri: 'cmdUri',
      reconnectTimeoutInSeconds: 7,
      dropDatabase: true,
    });
  });
});
