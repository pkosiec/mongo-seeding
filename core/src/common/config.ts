import * as extend from 'extend';
import { resolve } from 'path';
import { AppConfig, DeepPartial, CollectionToImport } from '.';

export const defaultConfig: AppConfig = {
  database: {
    protocol: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    name: 'database',
    username: undefined,
    password: undefined,
  },
  databaseConnectionUri: undefined,
  inputPath: resolve(__dirname, '../../data'), // input directory with import data structure
  dropDatabase: false, // drops entire database before import
  dropCollection: false, // drops collection before importing it
  replaceIdWithUnderscoreId: false, // rewrites `id` property to `_id` for every document
  supportedExtensions: ['json', 'js'], // files that should be imported
  reconnectTimeoutInSeconds: 10, // maximum time of waiting for successful MongoDB connection
};

export const getConfig = (ownConfig: DeepPartial<AppConfig>): AppConfig => {
  const config = {};
  return extend(true, config, defaultConfig, ownConfig);
};

export interface CollectionReadingConfig {
  extensions: string[];
  transformers: Array<(collection: CollectionToImport) => CollectionToImport>;
}

const defaultCollectionReadingConfig: CollectionReadingConfig = {
  extensions: ['json', 'js'], // files that should be imported
  transformers: [],
};

export const getCollectionReadingConfig = (
  ownConfig: DeepPartial<CollectionReadingConfig>,
): CollectionReadingConfig => {
  const config = {};
  return extend(true, config, defaultCollectionReadingConfig, ownConfig);
};
