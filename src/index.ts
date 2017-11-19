import { AppConfig, getConfig, DeepPartial } from './config';
import { connectToDatabase } from './connectToDatabase';
import { DataImporter } from './DataImporter';

const log = require('debug')('mongo-seeding');

export const seedDatabase = async (partialConfig: DeepPartial<AppConfig>) => {
  const config = getConfig(partialConfig);

  try {
    log('Starting...');
    const db = await connectToDatabase(
      config.database,
      config.reconnectTimeout,
      log,
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
