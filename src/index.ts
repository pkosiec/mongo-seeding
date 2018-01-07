import { AppConfig, getConfig, DeepPartial } from './config';
import { DataImporter } from './DataImporter';
import { DatabaseConnector } from './DatabaseConnector';
import { MongoClient } from 'mongodb';

const log = require('debug')('mongo-seeding');

export const seedDatabase = async (partialConfig: DeepPartial<AppConfig>) => {
  const config = getConfig(partialConfig);

  try {
    log('Starting...');
    const databaseConnector = new DatabaseConnector(MongoClient, log);
    const db = await databaseConnector.connect(
      config.database,
      config.reconnectTimeout,
    );

    if (config.dropDatabase) {
      log('Dropping database...');
      await db.dropDatabase();
    }

    await new DataImporter(db, log).importData(config);
    await db.close();

    log('Exiting...');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
