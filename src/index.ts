import { AppConfig, getConfig, DeepPartial } from './config';
import { DatabaseConnector } from './DatabaseConnector';
import { DataImporter } from './DataImporter';
import { DataPopulator } from './DataPopulator';
import { log } from './logger';
import { MongoClient } from 'mongodb';

export const seedDatabase = async (partialConfig: DeepPartial<AppConfig>) => {
  log('Starting...');

  const config = getConfig(partialConfig);
  const databaseConnector = new DatabaseConnector(new MongoClient());

  try {
    const database = await databaseConnector.connect(
      config.database,
      config.reconnectTimeoutInSeconds,
    );

    if (config.dropDatabase) {
      await database.drop();
    }

    const collections = new DataPopulator().populate(config.dataPath);
    await new DataImporter(database).importData(collections);
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
