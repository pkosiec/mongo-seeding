import { seedDatabase } from 'mongo-seeding';
import { resolve } from 'path';
import { DeepPartial, AppConfig } from 'mongo-seeding/common';

const env = process.env;
const envOptions: DeepPartial<AppConfig> = {
  database: {
    protocol: env.DB_PROTOCOL ? String(env.DB_PROTOCOL) : undefined,
    host: env.DB_HOST ? String(env.DB_HOST) : undefined,
    port: env.DB_PORT ? Number(env.DB_PORT) : undefined,
    name: env.DB_NAME ? String(env.DB_NAME) : undefined,
    username: env.DB_USERNAME ? String(env.DB_USERNAME) : undefined,
    password: env.DB_PASSWORD ? String(env.DB_PASSWORD) : undefined,
  },
  databaseConnectionUri: env.DB_CONNECTION_URI
    ? String(env.DB_CONNECTION_URI)
    : undefined,
  dropDatabase: env.DROP_DATABASE === 'true',
  replaceIdWithUnderscoreId: env.REPLACE_ID_TO_UNDERSCORE_ID === 'true',
  supportedExtensions: ['ts', 'js', 'json'],
  inputPath: resolve(__dirname, '../data'),
  reconnectTimeoutInSeconds: env.RECONNECT_TIMEOUT_IN_SECONDS
    ? Number(env.RECONNECT_TIMEOUT_IN_SECONDS)
    : undefined,
};

(async () => {
  try {
    await seedDatabase(envOptions);
  } catch (err) {
    console.error(`Error ${err.name}: ${err.message}`);
    process.exit(1);
  }
})();
