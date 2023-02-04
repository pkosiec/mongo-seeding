import * as extend from 'extend';
import { SeederCollection, DeepPartial } from './common';
import { SeederDatabaseConfig, defaultDatabaseConfigObject } from './database';
import { BulkWriteOptions, MongoClientOptions } from 'mongodb';
import { EJSONOptions } from 'bson';

/**
 * Defines configuration for database seeding.
 */
export interface SeederConfig {
  /**
   * Database connection URI or configuration object.
   */
  database: SeederDatabaseConfig;
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

/**
 * Stores default configuration for database seeding.
 */
export const defaultSeederConfig: SeederConfig = {
  database: defaultDatabaseConfigObject,
  databaseReconnectTimeout: 10000,
  dropDatabase: false,
  dropCollections: false,
  removeAllDocuments: false,
};

/**
 * Merges configuration for database seeding.
 *
 * @param partial Partial config object. If not specified, returns a default config object.
 * @param previous Previous config object. If not specified, uses a default config object as a base.
 */
export const mergeSeederConfig = (
  partial?: DeepPartial<SeederConfig>,
  previous?: SeederConfig,
): SeederConfig => {
  const source = previous ? previous : defaultSeederConfig;

  if (!partial) {
    return source;
  }

  const config = {};
  return extend(true, config, source, partial);
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
  extensions: ['json', 'js', 'cjs', 'mjs'],
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
