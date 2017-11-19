import { AppConfig, DeepPartial } from './config';
import { resolve } from 'path';

const convertOptions = (options: {
  data: string;
  tsconfig: string;
  'drop-database': boolean;
  'convert-id': boolean;
  'db-protocol': string;
  'db-host': string;
  'db-port': number;
  'db-name': string;
}): DeepPartial<AppConfig> => {
  return {
    database: {
      protocol: options['db-protocol'],
      host: options['db-host'],
      port: options['db-port'],
      name: options['db-name'],
    },
    dataPath: options.data ? resolve(options.data) : undefined,
    dropDatabase: options['drop-database'],
    convertId: options['convert-id'],
    debugLogging: true,
  };
};

export const run = (options: any) => {
  const partialConfig = convertOptions(options);
  require('./index').seedDatabase(partialConfig);
};
