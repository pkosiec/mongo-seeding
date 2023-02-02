import * as extend from 'extend';
import { SeederCollection, DeepPartial } from './common';
import { SeederDatabaseConfig, defaultDatabaseConfigObject } from './database';
import { BulkWriteOptions, MongoClientOptions } from 'mongodb';
import { EJSONOptions } from 'bson';

/**
 * Defines configuration for database seeding.
 */
export interface SeederConfig {
  database: SeederDatabaseConfig; // database connection URI or configuration object
  databaseReconnectTimeout: number; // maximum time of waiting for successful MongoDB connection in milliseconds. Ignored when `mongoClientOptions` are passed.
  dropDatabase: boolean; // drops entire database before import
  dropCollections: boolean; // drops collection before importing it
  removeAllDocuments: boolean; // deletes all documents from every collection that is being imported
  mongoClientOptions?: MongoClientOptions; // optional MongoDB client options
  bulkWriteOptions?: BulkWriteOptions; // optional MongoDB collection create options
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
  extensions: string[]; // files that should be imported
  ejsonParseOptions?: EJSONOptions; // options for parsing EJSON files with `.json` extension
  transformers: Array<(collection: SeederCollection) => SeederCollection>; // optional transformer functions
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
