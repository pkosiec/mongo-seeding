import { cliSeeder } from '../../src/index';
import { CommandLineArguments } from '../../src/types';

describe('Index', () => {
  it('should fallback to default input path', () => {
    const testCases: Array<{
      options: CommandLineArguments;
      expected: string;
    }> = [
      {
        options: {},
        expected: cliSeeder.DEFAULT_INPUT_PATH,
      },
      {
        options: { data: '/test/path' },
        expected: '/test/path',
      },
    ];

    for (const testCase of testCases) {
      // @ts-ignore
      const result = cliSeeder.getCollectionsPath(testCase.options);
      expect(result).toEqual(testCase.expected);
    }
  });
});
