import { log, DeepPartial, SeederCollection } from './common';
import { DatabaseConnector } from './database';
import { DefaultTransformers, CollectionTransformer } from './transformer';
import { CollectionImporter } from './importer';
import {
  SeederCollectionReadingOptions,
  defaultSeederConfig,
  SeederConfig,
  mergeSeederConfig,
  mergeCollectionReadingOptions,
} from './config';

export * from './config';

export class Seeder {
  static Transformers = DefaultTransformers;

  config: SeederConfig = defaultSeederConfig;

  constructor(config?: DeepPartial<SeederConfig>) {
    this.config = mergeSeederConfig(config);
  }

  readCollectionsFromPath = (
    path: string,
    partialConfig?: DeepPartial<SeederCollectionReadingOptions>,
  ): SeederCollection[] => {
    const config = mergeCollectionReadingOptions(partialConfig);
    let collections;
    try {
      const { CollectionPopulator } = require('./populator');
      const populator = new CollectionPopulator(config.extensions);

      log(`Reading collections from ${path}...`);
      collections = populator.readFromPath(path);
    } catch (err) {
      throw wrapError(err);
    }

    if (config.transformers.length > 0) {
      log('Transforming collections...');
      collections = new CollectionTransformer().transform(
        collections,
        config.transformers,
      );
    }

    return collections;
  };

  import = async (
    collections: SeederCollection[],
    partialConfig?: DeepPartial<SeederConfig>,
  ) => {
    if (collections.length === 0) {
      log('No data to import. Finishing...');
      return;
    }

    log('Starting collection import...');
    const config = mergeSeederConfig(partialConfig, this.config);
    const databaseConnector = new DatabaseConnector(
      config.databaseReconnectTimeout,
    );

    try {
      const database = await databaseConnector.connect(config.database);

      if (!config.dropDatabase && config.dropCollections) {
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
