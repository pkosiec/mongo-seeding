import {
  log,
  DeepPartial,
  AppConfig,
  CollectionReadingConfig,
  getCollectionReadingConfig,
  mergeAppConfig,
} from './common';
import { DatabaseConnector } from './database';
import { DataImporter } from './data-processing';
import { defaultConfig, CollectionToImport } from '../dist/common';
import { CollectionPopulator } from 'collection-populator/CollectionPopulator';
import { CollectionTransformer } from 'collection-transformer/CollectionTransformer';

export class Seeder {
  config: AppConfig = defaultConfig;

  constructor(config: DeepPartial<AppConfig>) {
    this.config = mergeAppConfig(config);
  }

  readCollectionsFromPath = (
    path: string,
    partialConfig: DeepPartial<CollectionReadingConfig>,
  ): CollectionToImport[] => {
    const config = getCollectionReadingConfig(partialConfig);
    let collections = new CollectionPopulator(config.extensions).readFromPath(
      path,
    );

    if (config.transformers.length > 0) {
      collections = new CollectionTransformer().transform(
        collections,
        config.transformers,
      );
    }

    return collections;
  };

  import = async (
    collections: CollectionToImport[],
    partialConfig: DeepPartial<AppConfig>,
  ) => {
    if (collections.length === 0) {
      log('No data to import. Finishing...');
      return;
    }

    log('Starting...');

    const config = mergeAppConfig(partialConfig, this.config);
    const databaseConnector = new DatabaseConnector(
      config.reconnectTimeoutInSeconds,
    );

    try {
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
}

const wrapError = (err: Error) => {
  const error = new Error(`${err.name}: ${err.message}`);
  error.name = 'MongoSeedingError';
  return error;
};
