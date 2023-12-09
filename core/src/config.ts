import * as extend from 'extend';
import { SeederCollection, DeepPartial } from './common';
import { BulkWriteOptions, MongoClientOptions } from 'mongodb';
import { EJSONOptions } from 'bson';
import { ConnectionString } from 'connection-string';
import { parseSeederDatabaseConfig } from './database';

/**
 * Defines configuration for database seeding.
 */
export interface SeederConfig {
  /**
   * Database connection URI or configuration object.
   */
  database?: SeederDatabaseConfig;
  /**
   * Maximum time of waiting for successful MongoDB connection in milliseconds. Ignored when `mongoClientOptions` are passed.
   */
  databaseReconnectTimeout: number;
  /**
   * Drops entire database before import.
   */
  dropDatabase: boolean;
  /**
   * Drops collection before importing it.
   */
  dropCollections: boolean;
  /**
   * Deletes all documents from every collection that is being imported.
   */
  removeAllDocuments: boolean;
  /**
   * Optional MongoDB client options.
   */
  mongoClientOptions?: MongoClientOptions;
  /**
   * Optional MongoDB collection write options.
   */
  bulkWriteOptions?: BulkWriteOptions;
}

export type SeederConfigWithoutDatabase = Omit<SeederConfig, 'database'>;

/**
 * Stores default configuration for database seeding.
 */
export const defaultSeederConfig: SeederConfigWithoutDatabase = {
  databaseReconnectTimeout: 10000,
  dropDatabase: false,
  dropCollections: false,
  removeAllDocuments: false,
};

/**
 * Represents database connection configuration. It can be a URI string or object.
 */
export type SeederDatabaseConfig = string | SeederDatabaseConfigObject;

/**
 * Defines configuration for Database connection in a form of an object.
 */
export interface SeederDatabaseConfigObject {
  /**
   * Database connection protocol
   */
  protocol: string;

  /**
   * Database connection host
   */
  host: string;

  /**
   * Database connection port
   */
  port: number;

  /**
   * Database name.
   */
  name: string;

  /**
   * Database Username.
   */
  username?: string;

  /**
   * Database password.
   */
  password?: string;

  /**
   * Options for MongoDB Database Connection URI.
   * Read more on: https://docs.mongodb.com/manual/reference/connection-string.
   */
  options?: SeederDatabaseConfigObjectOptions;
}

/**
 * Defines options for MongoDB Database Connection URI.
 * Read more on: https://docs.mongodb.com/manual/reference/connection-string.
 */
export interface SeederDatabaseConfigObjectOptions {
  [key: string]: unknown;
}

/**
 * Merges configuration for seeding and deletes database property.
 *
 * @param partial Partial config object. If not specified, returns a default config object.
 * @param previous Previous config object. If not specified, uses a default config object as a base.
 */
export const mergeSeederConfigAndDeleteDb = (
  partial?: DeepPartial<SeederConfig>,
  previous?: SeederConfig,
): SeederConfigWithoutDatabase => {
  const source = previous ? previous : defaultSeederConfig;
  if ('database' in source) {
    delete source.database;
  }

  if (!partial) {
    return source;
  }

  const config = {};
  delete partial.database;
  return extend(true, config, source, partial);
};

export const mergeConnection = (
  partial?: DeepPartial<SeederDatabaseConfig>,
  previous?: ConnectionString,
): ConnectionString => {
  const source = previous ?? parseSeederDatabaseConfig(undefined);
  if (source.hosts && source.hosts.length > 1) {
    source.hosts = [source.hosts[0]];
  }
  if (!partial) {
    return source;
  }

  if (typeof partial === 'string') {
    return parseSeederDatabaseConfig(partial);
  }

  const partialConn = parseSeederDatabaseConfig(partial, true);

  // override hosts manually
  if (
    partialConn.hosts &&
    partialConn.hosts.length > 0 &&
    source.hosts &&
    source.hosts.length > 0
  ) {
    const newHost = partialConn.hosts[0];
    if (!newHost.name) {
      newHost.name = source.hosts[0].name;
    }

    if (!newHost.port) {
      newHost.port = source.hosts[0].port;
    }
  }

  const config = new ConnectionString();
  return extend(true, config, source, partialConn);
};

/**
 * Defines collection reading configuration.
 */
export interface SeederCollectionReadingOptions {
  /**
   * Files extensions that should be imported
   */
  extensions: string[];

  /**
   * Options for parsing EJSON files with `.json` extension
   */
  ejsonParseOptions?: EJSONOptions;

  /**
   * Optional transformer functions that can be used to modify collection data before import.
   */
  transformers: ((collection: SeederCollection) => SeederCollection)[];
}

/**
 * Stores default collection reading configuration values.
 */
export const defaultCollectionReadingOptions: SeederCollectionReadingOptions = {
  extensions: ['json', 'js', 'cjs'],
  ejsonParseOptions: {
    relaxed: true,
  },
  transformers: [],
};

/**
 * Merges configuration for collection reading.
 *
 * @param partial Partial config object. If not specified, returns a default config object.
 * @param previous Previous config object. If not specified, uses a default config object as a base.
 */
export const mergeCollectionReadingOptions = (
  partial?: DeepPartial<SeederCollectionReadingOptions>,
  previous?: SeederCollectionReadingOptions,
): SeederCollectionReadingOptions => {
  const source = previous ? previous : defaultCollectionReadingOptions;

  if (!partial) {
    return source;
  }

  const config = {};
  return extend(true, config, source, partial);
};
