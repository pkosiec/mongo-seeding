import { AppConfig, getConfig, DeepPartial } from './config';
import { DatabaseConnector } from './DatabaseConnector';
import { DataImporter } from './DataImporter';
import { DataPopulator } from './DataPopulator';
import { log } from './logger';
import { MongoClient } from 'mongodb';
import { DataTransformer } from 'DataTransformer';

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

    let collections = new DataPopulator().populate(
      config.dataPath,
      config.supportedExtensions,
    );

    if (config.replaceIdWithUnderscoreId) {
      collections = new DataTransformer().transform(
        collections,
        DataTransformer.replaceDocumentIdWithUnderscoreId,
      );
    }

    await new DataImporter(database).import(collections);
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
