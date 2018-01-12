import { MongoClient } from 'mongodb';
import { AppConfig, getConfig, DeepPartial } from './config';
import { DatabaseConnector } from './DatabaseConnector';
import { DataImporter } from './DataImporter';
import { log } from './logger';

export const seedDatabase = async (partialConfig: DeepPartial<AppConfig>) => {
  const config = getConfig(partialConfig);

  try {
    log('Starting...');
    const database = await new DatabaseConnector(MongoClient).connect(
      config.database,
      config.reconnectTimeout,
    );

    if (config.dropDatabase) {
      await database.drop();
    }

    await new DataImporter(database).importData(config);
    await database.closeConnection();

    log('Exiting...');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
