import * as extend from 'extend';
import { SeederCollection, DeepPartial } from './common';
import { SeederDatabaseConfig, defaultDatabaseConfigObject } from './database';

export interface SeederConfig {
  database: SeederDatabaseConfig; // database connection URI or configuration object
  databaseReconnectTimeout: number; // maximum time of waiting for successful MongoDB connection in milliseconds
  dropDatabase: boolean; // drops entire database before import
  dropCollections: boolean; // drops collection before importing it
}

export const defaultSeederConfig: SeederConfig = {
  database: defaultDatabaseConfigObject,
  databaseReconnectTimeout: 10000,
  dropDatabase: false,
  dropCollections: false,
};

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

export interface SeederCollectionReadingOptions {
  extensions: string[]; // files that should be imported
  transformers: Array<(collection: SeederCollection) => SeederCollection>; // optional transformer functions
}

const defaultCollectionReadingOptions: SeederCollectionReadingOptions = {
  extensions: ['json', 'js'],
  transformers: [],
};

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
