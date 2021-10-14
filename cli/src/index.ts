import * as commandLineArgs from 'command-line-args';
import { register } from 'ts-node';
import { resolve } from 'path';
import { Seeder } from 'mongo-seeding';
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
      return this.printErrorAndExit(err as Error);
    }

    if (shouldShowHelp(options)) {
      showHelp();
      return;
    }

    try {
      validateOptions(options);
    } catch (err) {
      return this.printErrorAndExit(err as Error);
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
      return this.printErrorAndExit(err as Error);
    }

    process.exit(0);
  };

  private printErrorAndExit = (err: Error) => {
    console.error(`Error ${err.name}: ${err.message}`);
    process.exit(1);
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
