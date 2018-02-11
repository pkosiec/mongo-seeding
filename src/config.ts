import * as extend from 'extend';
import { resolve } from 'path';
import { AppConfig, DeepPartial } from './types';

export const defaultConfig: AppConfig = {
  database: {
    protocol: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    name: 'database',
    username: undefined,
    password: undefined,
  },
  inputPath: resolve(__dirname, '../../data'),
  dropDatabase: false,
  replaceIdWithUnderscoreId: false,
  supportedExtensions: ['json', 'js'],
  reconnectTimeoutInSeconds: 10,
};

export const getConfig = (ownConfig: DeepPartial<AppConfig>): AppConfig => {
  const config = {};
  return extend(true, config, defaultConfig, ownConfig);
};
