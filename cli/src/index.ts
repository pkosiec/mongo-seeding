import * as commandLineArgs from 'command-line-args';
import { register } from 'ts-node';
import { resolve } from 'path';
import { Seeder, SeederConfig } from 'mongo-seeding';
import {
  cliOptions,
  validateOptions,
  createConfigFromOptions,
} from './options';
import { showHelp, shouldShowHelp } from './help';
import { CommandLineArguments, CliSpecificOptions } from './types';
import { DeepPartial } from 'mongo-seeding/dist/common';

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
    this.useCliSpecificOptions(config.cli);

    const seeder = new Seeder(config.seeder);

    try {
      const collections = seeder.readCollectionsFromPath(
        resolve(config.cli!.dataPath!),
        config.collectionReading,
      );

      await seeder.import(collections);
    } catch (err) {
      this.printError(err);
    }

    process.exit(0);
  };

  private printError = (err: Error) => {
    console.error(`Error ${err.name}: ${err.message}`);
    process.exit(0);
  };

  private useCliSpecificOptions(options: DeepPartial<CliSpecificOptions> = {}) {
    if (!options.silent) {
      // Enable debug output for Mongo Seeding
      process.env.DEBUG = 'mongo-seeding';
    }

    register({
      transpileOnly: options.transpileOnly,
      compiler: require.resolve('typescript', { paths: [__dirname] }),
    });
  }
}

export const cliSeeder = new CliSeeder();
