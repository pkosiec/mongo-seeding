import { AppConfig, getConfig, DeepPartial } from './config';
import { databaseConnector } from './DatabaseConnector';
import { DataImporter } from './DataImporter';
import { log } from './logger';

export const seedDatabase = async (partialConfig: DeepPartial<AppConfig>) => {
  const config = getConfig(partialConfig);
  log('Starting...');
  const database = await databaseConnector.connect(
    config.database,
    config.reconnectTimeout,
  );

  if (config.dropDatabase) {
    await database.drop();
  }

  await new DataImporter(database).importData(config);
  await databaseConnector.close();
  log('Finishing...');
};
