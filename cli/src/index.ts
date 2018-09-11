// Enable debug output for Mongo Seeding
process.env.DEBUG = 'mongo-seeding';

import { seedDatabase } from 'mongo-seeding';
import {
  populateOptions,
  optionsDefinition,
  shouldShowHelp,
  CommandLineOptions,
  validateOptions,
} from './options';
import { showHelp } from './help';

import * as commandLineArgs from "command-line-args";

export const run = async () => {
  const options: CommandLineOptions = commandLineArgs(optionsDefinition) as CommandLineOptions;

  if (shouldShowHelp(options)) {
    showHelp();
    return;
  }

  const partialConfig = populateOptions(options);
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
