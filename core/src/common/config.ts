import * as extend from 'extend';
import { SeederConfig, DeepPartial, SeederCollection } from './';

export const defaultSeederConfig: SeederConfig = {
  database: {
    protocol: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    name: 'database',
    username: undefined,
    password: undefined,
  },
  databaseReconnectTimeout: 10000,
  dropDatabase: false,
  dropCollection: false,
};

export const mergeSeederConfig = (
  partial: DeepPartial<SeederConfig>,
  previous?: SeederConfig,
): SeederConfig => {
  const source = previous ? previous : defaultSeederConfig;
  const config = {};
  return extend(true, config, source, partial);
};

// TODO: Move somewhere

export interface SeederCollectionReadingConfig {
  extensions: string[];
  transformers: Array<(collection: SeederCollection) => SeederCollection>;
}

const defaultCollectionReadingConfig: SeederCollectionReadingConfig = {
  extensions: ['json', 'js'], // files that should be imported
  transformers: [], // optional transformer functions
};

export const mergeCollectionReadingConfig = (
  ownConfig: DeepPartial<SeederCollectionReadingConfig>,
  previous?: SeederCollectionReadingConfig,
): SeederCollectionReadingConfig => {
  const source = previous ? previous : defaultCollectionReadingConfig;
  const config = {};
  return extend(true, config, source, ownConfig);
};
