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
  const databaseConnector = new DatabaseConnector(config.reconnectTimeoutInSeconds);

  try {
    let collections = new DataPopulator(config.supportedExtensions).populate(
      config.inputPath,
    );

    if (config.replaceIdWithUnderscoreId) {
      collections = new DataTransformer().transform(
        collections,
        DataTransformer.replaceDocumentIdWithUnderscoreId,
      );
    }

    if (collections.length === 0) {
      log('No data to import. Finishing...');
      return;
    }

    const database = await databaseConnector.connect({
      databaseConnectionUri: config.databaseConnectionUri,
      databaseConfig: config.database,
    });
    
    if (!config.dropDatabase && config.dropCollection) {
      log('Dropping collections...');
      for (const collection of collections) {
          await database.dropCollectionIfExists(collection.name);
      }
    }

    if (config.dropDatabase) {
      log('Dropping database...');
      await database.drop();
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
