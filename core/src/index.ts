import {
  log,
  DeepPartial,
  SeederConfig,
  SeederCollectionReadingConfig,
  getCollectionReadingConfig,
  mergeSeederConfig,
  defaultSeederConfig,
  SeederCollection,
} from './common';
import { DatabaseConnector } from './database';
import { CollectionImporter } from './data-processing';
import { CollectionPopulator } from 'collection-populator/CollectionPopulator';
import { CollectionTransformer } from 'collection-transformer/CollectionTransformer';
import { DefaultTransformers } from 'collection-transformer/Transformers';

export class Seeder {
  static Transformers = DefaultTransformers;

  config: SeederConfig = defaultSeederConfig;

  constructor(config: DeepPartial<SeederConfig>) {
    this.config = mergeSeederConfig(config);
  }

  readCollectionsFromPath = (
    path: string,
    partialConfig: DeepPartial<SeederCollectionReadingConfig>,
  ): SeederCollection[] => {
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
    collections: SeederCollection[],
    partialConfig: DeepPartial<SeederConfig>,
  ) => {
    if (collections.length === 0) {
      log('No data to import. Finishing...');
      return;
    }

    log('Starting...');

    const config = mergeSeederConfig(partialConfig, this.config);
    const databaseConnector = new DatabaseConnector(
      config.databaseReconnectTimeout,
    );

    try {
      const database = await databaseConnector.connect(config.database);

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

      await new CollectionImporter(database).import(collections);
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
