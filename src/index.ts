import { MongoClient } from 'mongodb';
import { log, getConfig, DeepPartial, AppConfig } from './common';
import { DatabaseConnector } from './database';
import {
  DataPopulator,
  DataTransformer,
  DataImporter,
} from './data-processing';

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
      log('Dropping database...');
      await database.drop();
    }

    let collections = new DataPopulator(config.supportedExtensions).populate(
      config.inputPath,
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
