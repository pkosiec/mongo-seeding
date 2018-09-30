const getUsage = require('command-line-usage');
const packageInfo = require('../package.json');
import { cliOptions } from './options';
import { CommandLineArguments } from './types';

const helpSections = [
  {
    header: `Mongo Seeding CLI ${packageInfo.version}`,
    content: packageInfo.description,
  },
  {
    header: 'Example usage',
    content: [
      '$ {bold seed}',
      '$ {bold seed ./seed-data/}',
      '$ {bold seed -u `mongodb://127.0.0.1:27017/mydbname` --drop-database --replace-id}',
      '$ {bold seed -u `mongodb://127.0.0.1:27017/mydbname` --replace-id /absolute/path/}',
    ],
  },
  {
    header: 'Parameters',
    optionList: cliOptions,
  },
  {
    content: `GitHub: {underline ${packageInfo.repository.url}}`,
  },
];

export const showHelp = () => {
  console.log(getUsage(helpSections));
};

export const shouldShowHelp = (options: CommandLineArguments) => {
  return options.help;
};
