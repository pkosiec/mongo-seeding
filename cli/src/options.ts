import { resolve } from 'path';
import { AppConfig, DeepPartial } from 'mongo-seeding/dist/common';

export interface CommandLineOptionDefinition {
  name: string;
  alias?: string;
  defaultOption?: boolean;
  description: string;
  type: StringConstructor | NumberConstructor | BooleanConstructor;
}

export const optionsDefinition: CommandLineOptionDefinition[] = [
  {
    name: 'data',
    alias: 'd',
    description:
      'Path to directory containing import data; default: {bold Current directory}',
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
    name: 'db-uri',
    alias: 'u',
    description:
      'If defined, the URI will be used for establishing connection to database, ignoring values defined via other `db-*` parameters, i.e. `db-name`, `db-host`, etc.; Default: {bold undefined}',
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
    name: 'drop-collection',
    description: 'Drops collection before importing it',
    type: Boolean,
  },
  {
    name: 'replace-id',
    description: 'Replaces `id` property with `_id` for every object to import',
    type: Boolean,
  },
  {
    name: 'help',
    alias: 'h',
    description: 'Shows this help info',
    type: Boolean,
  },
];

export interface CommandLineOptions {
  data?: string;
  [key: string]: string | number | boolean | undefined;
  'drop-database': boolean;
  'drop-collection': boolean;
  'replace-id': boolean;
  'db-protocol'?: string;
  'db-host'?: string;
  'db-port'?: number;
  'db-name'?: string;
  'db-username'?: string;
  'db-password'?: string;
  'db-uri'?: string;
  'reconnect-timeout'?: number;
}

export const shouldShowHelp = (options: CommandLineOptions) => {
  return options.help;
};

export const validateOptions = (options: CommandLineOptions) => {
  validatePositiveNumber(options['db-port'], 'db-port');
  validatePositiveNumber(options['reconnect-timeout'], 'reconnect-timeout');
};

const validatePositiveNumber = (variable: number | undefined, name: string) => {
  if (typeof variable !== 'undefined' && (isNaN(variable) || variable < 0)) {
    const error = new Error(
      `Value of '${name}' parameter should be a valid positive number`,
    );
    error.name = 'InvalidParameterError';
    throw error;
  }
};

export const populateCommandLineOptions = (
  options: CommandLineOptions,
): DeepPartial<AppConfig> => ({
  database: {
    protocol: options['db-protocol'],
    host: options['db-host'],
    port: options['db-port'],
    name: options['db-name'],
    username: options['db-username'],
    password: options['db-password'],
  },
  databaseConnectionUri: options['db-uri'],
  inputPath: options.data ? resolve(options.data) : resolve('./'),
  dropDatabase: options['drop-database'],
  dropCollection: options['drop-collection'],
  replaceIdWithUnderscoreId: options['replace-id'],
  reconnectTimeoutInSeconds: options['reconnect-timeout'],
});

export const populateEnvOptions = (): DeepPartial<AppConfig> => {
  const env = process.env;
  const envOptions: DeepPartial<AppConfig> = {
    database: {
      protocol: env.DB_PROTOCOL ? String(env.DB_PROTOCOL) : undefined,
      host: env.DB_HOST ? String(env.DB_HOST) : undefined,
      port: env.DB_PORT ? Number(env.DB_PORT) : undefined,
      name: env.DB_NAME ? String(env.DB_NAME) : undefined,
      username: env.DB_USERNAME ? String(env.DB_USERNAME) : undefined,
      password: env.DB_PASSWORD ? String(env.DB_PASSWORD) : undefined,
    },
    databaseConnectionUri: env.DB_URI ? String(env.DB_URI) : undefined,
    dropDatabase: env.DROP_DATABASE === 'true',
    dropCollection: env.DROP_COLLECTION === 'true',
    replaceIdWithUnderscoreId: env.REPLACE_ID === 'true',
    supportedExtensions: ['ts', 'js', 'json'],
    reconnectTimeoutInSeconds: env.RECONNECT_TIMEOUT
      ? Number(env.RECONNECT_TIMEOUT)
      : undefined,
  };

  return envOptions;
};
