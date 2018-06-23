const getUsage = require('command-line-usage');
const packageInfo = require('../package.json');
import { optionsDefinition } from './options';

const helpSections = [
  {
    header: `Mongo Seeding CLI ${packageInfo.version}`,
    content: packageInfo.description,
  },
  {
    header: 'Example usage',
    content: [
      '$ {bold seed}',
      '$ {bold seed -u `mongodb://127.0.0.1:27017/mydbname` --drop-database --replace-id}',
    ],
  },
  {
    header: 'Parameters',
    optionList: optionsDefinition,
  },
  {
    content: `GitHub: {underline ${packageInfo.repository.url}}`,
  },
];

export const showHelp = () => {
  console.log(getUsage(helpSections));
};
