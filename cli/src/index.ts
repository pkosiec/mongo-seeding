// Enable debug output for Mongo Seeding
process.env.DEBUG = 'mongo-seeding';

import { seedDatabase } from 'mongo-seeding';
import {
  convertOptions,
  optionsDefinition,
  shouldShowHelp,
  CommandLineOptions,
  validateOptions,
} from './options';
import { showHelp } from './help';

export const run = async (options: CommandLineOptions) => {
  if (shouldShowHelp(options)) {
    showHelp();
    return;
  }

  const partialConfig = convertOptions(options);
  try {
    validateOptions(options);
    await seedDatabase(partialConfig);
  } catch (err) {
    printError(err);
  }

  process.exit(0);
};

const printError = (err: Error) => {
  console.error(`Error ${err.name}: ${err.message}`);
};
