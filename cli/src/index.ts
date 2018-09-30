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

export const run = async () => {
  let options: CommandLineArguments;

  try {
    options = commandLineArgs(cliOptions) as CommandLineArguments;
  } catch (err) {
    printError(err);
    process.exit(0);
    return;
  }

  if (shouldShowHelp(options)) {
    showHelp();
    return;
  }

  try {
    validateOptions(options);
  } catch (err) {
    printError(err);
  }

  const config = createConfigFromOptions(options);
  const collectionsPath = options.data ? resolve(options.data) : resolve('./');

  const seeder = new Seeder(config);

  const replaceIdWithUnderscoreId =
    options['replace-id'] || process.env.REPLACE_ID === 'true';
  const transformers = replaceIdWithUnderscoreId
    ? [Seeder.Transformers.replaceDocumentIdWithUnderscoreId]
    : [];
  const collectionReadingConfig: SeederCollectionReadingConfig = {
    extensions: ['ts', 'js', 'json'],
    transformers,
  };

  const collections = seeder.readCollectionsFromPath(
    collectionsPath,
    collectionReadingConfig,
  );

  await seeder.import(collections);

  process.exit(0);
};

const printError = (err: Error) => {
  console.error(`Error ${err.name}: ${err.message}`);
};
