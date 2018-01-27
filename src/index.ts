import { AppConfig, getConfig, DeepPartial } from './config';
import { DatabaseConnector } from './DatabaseConnector';
import { DataImporter } from './DataImporter';
import { log } from './logger';
import { MongoClient } from 'mongodb';

export const seedDatabase = async (partialConfig: DeepPartial<AppConfig>) => {
  log('Starting...');

  const config = getConfig(partialConfig);
  const databaseConnector = new DatabaseConnector(new MongoClient());

  try {
    const database = await databaseConnector.connect(
      config.database,
      config.reconnectTimeout,
    );

    if (config.dropDatabase) {
      await database.drop();
    }
    await new DataImporter(database).importData(config);
  } catch (err) {
    throw wrapError(err);
  } finally {
    await databaseConnector.close();
  }

  log('Finishing...');
};

const wrapError = (err: Error) => {
  const error = new Error(`${err.name}: ${err.message}`);
  error.name = 'MongoSeedingError';
  return error;
};
