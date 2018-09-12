// Enable debug output for Mongo Seeding
process.env.DEBUG = 'mongo-seeding';

import * as commandLineArgs from 'command-line-args';
import * as extend from 'extend';
import { seedDatabase } from 'mongo-seeding';
import {
  populateCommandLineOptions,
  optionsDefinition,
  shouldShowHelp,
  CommandLineOptions,
  validateOptions,
  populateEnvOptions,
} from './options';
import { showHelp } from './help';
import { AppConfig, DeepPartial } from 'mongo-seeding/dist/common';

export const run = async () => {
  let options: CommandLineOptions;

  try {
    options = commandLineArgs(optionsDefinition) as CommandLineOptions;
  } catch (err) {
    printError(err);
    process.exit(0);
    return;
  }

  if (shouldShowHelp(options)) {
    showHelp();
    return;
  }

  const config = getConfig(options);

  try {
    validateOptions(options);
    await seedDatabase(config);
  } catch (err) {
    printError(err);
  }

  process.exit(0);
};

const getConfig = (options: CommandLineOptions): DeepPartial<AppConfig> => {
  const commandLineConfig = populateCommandLineOptions(options);
  const envConfig = populateEnvOptions();
  const config = {};
  return extend(true, config, envConfig, commandLineConfig);
};

const printError = (err: Error) => {
  console.error(`Error ${err.name}: ${err.message}`);
};
