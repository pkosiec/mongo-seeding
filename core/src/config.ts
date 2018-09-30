import * as extend from 'extend';
import { SeederCollection, DeepPartial } from './common';
import { SeederDatabaseConfig, defaultDatabaseConfigObject } from './database';

export interface SeederConfig {
  database: SeederDatabaseConfig; // database connection URI or configuration object
  databaseReconnectTimeout: number; // maximum time of waiting for successful MongoDB connection in milliseconds
  dropDatabase: boolean; // drops entire database before import
  dropCollection: boolean; // drops collection before importing it
}

export const defaultSeederConfig: SeederConfig = {
  database: defaultDatabaseConfigObject,
  databaseReconnectTimeout: 10000,
  dropDatabase: false,
  dropCollection: false,
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

export interface SeederCollectionReadingConfig {
  extensions: string[]; // files that should be imported
  transformers: Array<(collection: SeederCollection) => SeederCollection>; // optional transformer functions
}

const defaultCollectionReadingConfig: SeederCollectionReadingConfig = {
  extensions: ['json', 'js'],
  transformers: [],
};

export const mergeCollectionReadingConfig = (
  partial?: DeepPartial<SeederCollectionReadingConfig>,
  previous?: SeederCollectionReadingConfig,
): SeederCollectionReadingConfig => {
  const source = previous ? previous : defaultCollectionReadingConfig;

  if (!partial) {
    return source;
  }

  const config = {};
  return extend(true, config, source, partial);
};
