import * as extend from 'extend';
import { throwOnNegativeNumber } from './validators';
import {
  CommandLineOption,
  CommandLineArguments,
  PartialCliOptions,
} from './types';
import { SeederDatabaseConfigObjectOptions } from 'mongo-seeding/dist/database';

export const cliOptions: CommandLineOption[] = [
  {
    name: 'data',
    alias: 'd',
    description:
      'Path to directory containing import data; default: {bold current directory}',
    type: String,
    defaultOption: true,
  },
  {
    name: 'db-protocol',
    description:
      'MongoDB database connection protocol; default: {bold mongodb}',
    type: String,
  },
  {
    name: 'db-host',
    description: 'MongoDB database host; default: {bold 127.0.0.1}',
    type: String,
  },
  {
    name: 'db-port',
    description: 'MongoDB database port; default: {bold 27017}',
    type: Number,
  },
  {
    name: 'db-name',
    description: 'MongoDB database name; default: {bold database}',
    type: String,
  },
  {
    name: 'db-username',
    description:
      'Username for connecting with database that requires authentication',
    type: String,
  },
  {
    name: 'db-password',
    description:
      'Password for connecting with database that requires authentication',
    type: String,
  },
  {
    name: 'db-options',
    description:
      'MongoDB connection options (https://docs.mongodb.com/manual/reference/connection-string/) in a form of multiple `KEY=VALUE` entries, separated by semicolon, e.g.: `ssl=true;maxPoolSize=50`; default: {bold undefined}',

    type: String,
  },
  {
    name: 'db-uri',
    alias: 'u',
    description:
      'If defined, the URI will be used for establishing connection to database, ignoring values defined via other `db-*` parameters, e.g. `db-name`, `db-host`, etc.; default: {bold undefined}',
    type: String,
  },
  {
    name: 'reconnect-timeout',
    description:
      'Maximum time in seconds, in which app should keep trying connecting to database; default: {bold 10}',
    type: Number,
  },
  {
    name: 'drop-database',
    description: 'Drops database before import',
    type: Boolean,
  },
  {
    name: 'drop-collections',
    description: 'Drops every collection that is being imported',
    type: Boolean,
  },
  {
    name: 'replace-id',
    description:
      'Replaces `id` property with `_id` for every document before import',
    type: Boolean,
  },
  {
    name: 'transpile-only',
    alias: 't',
    description:
      'Disables type checking on TypeScript files import. This option vastly improves performance of TypeScript data import; default: {bold false}',
    type: Boolean,
  },
  {
    name: 'help',
    alias: 'h',
    description: 'Shows this help info',
    type: Boolean,
  },
];

export const validateOptions = (options: CommandLineArguments) => {
  throwOnNegativeNumber(options['db-port'], 'db-port');
  throwOnNegativeNumber(options['reconnect-timeout'], 'reconnect-timeout');
};

export const createConfigFromOptions = (
  cmdArgs: CommandLineArguments,
): PartialCliOptions => {
  const commandLineConfig = populateCommandLineOptions(cmdArgs);
  const envConfig = populateEnvOptions();
  const config = {};
  return extend(true, config, envConfig, commandLineConfig);
};

function populateCommandLineOptions(
  options: CommandLineArguments,
): PartialCliOptions {
  return {
    database: options['db-uri']
      ? options['db-uri']
      : convertEmptyObjectToUndefined({
          protocol: options['db-protocol'],
          host: options['db-host'],
          port: options['db-port'],
          name: options['db-name'],
          username: options['db-username'],
          password: options['db-password'],
          options: readDbOptions(options['db-options']),
        }),
    databaseReconnectTimeout: options['reconnect-timeout'],
    dropDatabase: options['drop-database'],
    dropCollections: options['drop-collections'],
    transpileOnly: options['transpile-only'],
  };
}

export const DB_OPTIONS_SEPARATOR = ';';
export const DB_OPTIONS_KEY_VALUE_SEPARATOR = '=';

function readDbOptions(
  optsStr: string | undefined,
): SeederDatabaseConfigObjectOptions | undefined {
  if (!optsStr) {
    return undefined;
  }

  return optsStr.split(DB_OPTIONS_SEPARATOR).reduce((prev, current = '') => {
    const [key, value] = current.split(DB_OPTIONS_KEY_VALUE_SEPARATOR);

    if (typeof value === 'undefined') {
      return prev;
    }

    return {
      ...prev,
      [key]: value,
    };
  }, {});
}

function populateEnvOptions(): PartialCliOptions {
  const env = process.env;
  return {
    database: env.DB_URI
      ? String(env.DB_URI)
      : convertEmptyObjectToUndefined({
          protocol: env.DB_PROTOCOL ? String(env.DB_PROTOCOL) : undefined,
          host: env.DB_HOST ? String(env.DB_HOST) : undefined,
          port: env.DB_PORT ? Number(env.DB_PORT) : undefined,
          name: env.DB_NAME ? String(env.DB_NAME) : undefined,
          username: env.DB_USERNAME ? String(env.DB_USERNAME) : undefined,
          password: env.DB_PASSWORD ? String(env.DB_PASSWORD) : undefined,
          options: env.DB_OPTIONS
            ? readDbOptions(String(env.DB_OPTIONS))
            : undefined,
        }),
    databaseReconnectTimeout: env.RECONNECT_TIMEOUT
      ? Number(env.RECONNECT_TIMEOUT)
      : undefined,
    dropDatabase: env.DROP_DATABASE === 'true',
    dropCollections: env.DROP_COLLECTIONS === 'true',
    transpileOnly: env.TRANSPILE_ONLY === 'true',
  };
}

export function convertEmptyObjectToUndefined(obj: any): object | undefined {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && typeof obj[key] !== 'undefined') {
      return obj;
    }
  }

  return undefined;
}
