// Enable debug output for Mongo Seeding
process.env.DEBUG = 'mongo-seeding';

import * as commandLineArgs from 'command-line-args';
import { resolve } from 'path';
import { Seeder, SeederCollectionReadingConfig } from 'mongo-seeding';
import {
  cliOptions,
  validateOptions,
  createConfigFromOptions,
} from './options';
import { showHelp, shouldShowHelp } from './help';
import { CommandLineArguments } from './types';

class CliSeeder {
  run = async () => {
    let options: CommandLineArguments;

    try {
      options = commandLineArgs(cliOptions) as CommandLineArguments;
    } catch (err) {
      this.printError(err);
      return;
    }

    if (shouldShowHelp(options)) {
      showHelp();
      return;
    }

    try {
      validateOptions(options);
    } catch (err) {
      this.printError(err);
      return;
    }

    const config = createConfigFromOptions(options);
    const seeder = new Seeder(config);

    const collectionsPath = options.data ? options.data : './';
    const collectionReadingConfig = this.getCollectionReadingConfig(options);

    try {
      const collections = seeder.readCollectionsFromPath(
        resolve(collectionsPath),
        collectionReadingConfig,
      );

      await seeder.import(collections);
    } catch (err) {
      this.printError(err);
    }

    process.exit(0);
  };

  private getCollectionReadingConfig = (
    options: CommandLineArguments,
  ): SeederCollectionReadingConfig => {
    const transformers = [];
    const replaceIdWithUnderscoreId =
      options['replace-id'] || process.env.REPLACE_ID === 'true';

    if (replaceIdWithUnderscoreId) {
      transformers.push(Seeder.Transformers.replaceDocumentIdWithUnderscoreId);
    }

    return {
      extensions: ['ts', 'js', 'json'],
      transformers,
    };
  };

  private printError = (err: Error) => {
    console.error(`Error ${err.name}: ${err.message}`);
    process.exit(0);
  };
}

export const cliSeeder = new CliSeeder();
