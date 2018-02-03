import * as extend from 'extend';
import { resolve } from 'path';

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export interface DatabaseConfig {
  protocol: string;
  host: string;
  port: number;
  name: string;
  username?: string;
  password?: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  dataPath: string;
  dropDatabase: boolean;
  replaceIdWithUnderscoreId: boolean;
  supportedExtensions: string[];
  reconnectTimeout: number;
}

export const defaultConfig: AppConfig = {
  database: {
    protocol: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    name: 'database',
    username: undefined,
    password: undefined,
  },
  dataPath: resolve(__dirname, '../../data'),
  dropDatabase: false,
  replaceIdWithUnderscoreId: false,
  supportedExtensions: ['json', 'js'],
  reconnectTimeout: 2000,
};

export const getConfig = (ownConfig: DeepPartial<AppConfig>): AppConfig => {
  const config = {};
  return extend(true, config, defaultConfig, ownConfig);
};
