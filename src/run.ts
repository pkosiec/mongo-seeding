import { AppConfig, DeepPartial } from './config';
import { seedDatabase } from './index';

const env = process.env;
const envOptions: DeepPartial<AppConfig> = {
  database: {
    protocol: env.DB_PROTOCOL ? String(env.DB_PROTOCOL) : undefined,
    host: env.DB_HOST ? String(env.DB_HOST) : undefined,
    port: env.DB_PORT ? Number(env.DB_PORT) : undefined,
    name: env.DB_NAME ? String(env.DB_NAME) : undefined,
  },
  dropDatabase: env.DROP_DATABASE === 'true',
  convertId: env.CONVERT_ID_TO_UNDERSCORE_ID === 'true',
  debugLogging: env.DEBUG_LOGGING === 'true',
};

seedDatabase(envOptions);
