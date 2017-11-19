import { AppConfig, LOG_TAG, getConfig, DeepPartial } from './config';
import { connectToDatabase } from './connectToDatabase';
import { DataImporter } from './DataImporter';

export const seedDatabase = async (partialConfig: DeepPartial<AppConfig>) => {
  const config = getConfig(partialConfig);

  try {
    config.debugLogging && console.log(LOG_TAG, 'Starting...');
    const db = await connectToDatabase(
      config.database,
      config.debugLogging,
      LOG_TAG,
    );

    if (config.dropDatabase) {
      config.debugLogging && console.log(LOG_TAG, 'Dropping database...');
      await db.dropDatabase();
    }

    await new DataImporter(db, config.debugLogging, LOG_TAG).importData(config);
    await db.close();

    config.debugLogging && console.log(LOG_TAG, 'Exiting...');
    process.exit(0);
  } catch (err) {
    config.debugLogging && console.error(err);
    process.exit(1);
  }
};
