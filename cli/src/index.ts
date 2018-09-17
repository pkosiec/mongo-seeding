// Enable debug output for Mongo Seeding
process.env.DEBUG = 'mongo-seeding';

import * as commandLineArgs from 'command-line-args';
import { seedDatabase } from 'mongo-seeding';
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

  const config = createConfigFromOptions(options);

  try {
    validateOptions(options);
    await seedDatabase(config);
  } catch (err) {
    printError(err);
  }

  process.exit(0);
};

const printError = (err: Error) => {
  console.error(`Error ${err.name}: ${err.message}`);
};
