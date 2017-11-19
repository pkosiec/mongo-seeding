const mergeAdvanced: any = require('object-merge-advanced');
import { resolve } from 'path';

const APP_NAME = 'Elastic MongoDB Seed';
const VERSION = process.env.npm_package_version || '';
export const LOG_TAG = `${APP_NAME} ${VERSION}:`;
export const SUPPORTED_EXTENSIONS = ['json', 'ts', 'js'];

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export interface DatabaseConfig {
  protocol: string;
  host: string;
  port: number;
  name: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  dataPath: string;
  dropDatabase: boolean;
  convertId: boolean;
  debugLogging: boolean;
}

const defaultConfig: AppConfig = {
  database: {
    protocol: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    name: 'database',
  },
  dataPath: resolve(__dirname, '../data'),
  dropDatabase: false,
  convertId: false,
  debugLogging: false,
};

export const getConfig = (ownConfig: DeepPartial<AppConfig>): AppConfig => {
  return mergeAdvanced(defaultConfig, ownConfig);
};
