import { AppConfig, getConfig, DeepPartial } from './config';
import { DatabaseConnector } from './DatabaseConnector';
import { DataImporter } from './DataImporter';
import { log } from './logger';
import { MongoClient } from 'mongodb';

export const seedDatabase = async (partialConfig: DeepPartial<AppConfig>) => {
  const config = getConfig(partialConfig);
  log('Starting...');
  const databaseConnector = new DatabaseConnector(new MongoClient());
  const database = await databaseConnector.connect(
    config.database,
    config.reconnectTimeout,
  );

  try {
    if (config.dropDatabase) {
      await database.drop();
    }
    await new DataImporter(database).importData(config);
  } catch (err) {
    console.error(err);
  }

  await databaseConnector.close();
  log('Finishing...');
};
