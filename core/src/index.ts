import {
  DeepPartial,
  SeederCollection,
  LogFn,
  NewLoggerInstance,
} from './common';
import { DatabaseConnector, Database } from './database';
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
export * from './helpers';

/**
 * Allows to seed database. It is a main Mongo Seeding class.
 */
export class Seeder {
  /**
   * Transformer functions for collections before data import.
   */
  static Transformers = DefaultTransformers;

  /**
   * Logger instance
   */
  log: LogFn;

  /**
   * Configuration for seeding database.
   */
  config: SeederConfig = defaultSeederConfig;

  /**
   * Constructs a new `Seeder` instance and loads configuration for data import.
   *
   * @param config Optional partial object with database seeding configuration. The object is merged with the default configuration object. To use all default settings, simply omit this parameter.
   */
  constructor(config?: DeepPartial<SeederConfig>) {
    this.config = mergeSeederConfig(config);
    this.log = NewLoggerInstance();
  }

  /**
   * Populates collections and their documents from given path.
   * The path has to contain file structure described on https://github.com/pkosiec/mongo-seeding/blob/main/docs/import-data-definition.md.
   *
   * @param path File path
   * @param partialConfig Optional partial collection reading configuration object. It is merged with default configuration object. To use all default settings, simply omit this parameter.
   */
  readCollectionsFromPath = (
    path: string,
    partialConfig?: DeepPartial<SeederCollectionReadingOptions>,
  ): SeederCollection[] => {
    const config = mergeCollectionReadingOptions(partialConfig);
    let collections;
    try {
      const { CollectionPopulator } = require('./populator');
      const populator = new CollectionPopulator(
        config.extensions,
        config.ejsonParseOptions,
        this.log,
      );

      this.log(`Reading collections from ${path}...`);
      collections = populator.readFromPath(path);
    } catch (err) {
      throw wrapError(err as Error);
    }

    if (config.transformers.length > 0) {
      this.log('Transforming collections...');
      collections = new CollectionTransformer().transform(
        collections,
        config.transformers,
      );
    }

    return collections;
  };

  /**
   * Connects to a database and imports all collections.
   *
   * @param collections Array of collection definitions
   * @param partialConfig Optional partial configuration object. Ita allows to change the database seeding configuration for single data import.   It is merged with default configuration object. To use the configuration provided in `Seeder` constructor, simply omit this parameter.
   */
  import = async (
    collections: SeederCollection[],
    partialConfig?: DeepPartial<SeederConfig>,
  ) => {
    if (collections.length === 0) {
      this.log('No data to import. Finishing...');
      return;
    }

    this.log('Starting collection import...');
    const config = mergeSeederConfig(partialConfig, this.config);
    const databaseConnector = new DatabaseConnector(
      config.databaseReconnectTimeout,
      config.mongoClientOptions,
      this.log,
    );

    let database: Database | undefined;
    try {
      database = await databaseConnector.connect(config.database);

      if (!config.dropDatabase && config.dropCollections) {
        this.log('Dropping collections...');
        for (const collection of collections) {
          await database.dropCollectionIfExists(collection.name);
        }
      }

      if (!config.dropDatabase && config.removeAllDocuments) {
        this.log('Removing all documents from collections...');
        const promises = collections.map(
          (collection) =>
            database?.removeAllDocumentsIfCollectionExists(collection.name),
        );
        await Promise.all(promises);
      }

      if (config.dropDatabase) {
        this.log('Dropping database...');
        await database.drop();
      }

      await new CollectionImporter(
        database,
        config.bulkWriteOptions,
        this.log,
      ).import(collections);
    } catch (err) {
      throw wrapError(err as Error);
    } finally {
      if (database) {
        await database.closeConnection();
      }
    }

    this.log('Finishing...');
  };
}

/**
 * Wraps error with custom name
 *
 * @param err Original error
 */
const wrapError = (err: Error) => {
  err.name = 'MongoSeedingError';
  err.message = `${err.name}: ${err.message}`;
  return err;
};
