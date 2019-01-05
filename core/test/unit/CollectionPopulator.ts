import { CollectionPopulator } from '../../src/populator';

describe('CollectionPopulator', () => {
  it('should throw an error when passed no supported extensions', () => {
    expect(() => {
      new CollectionPopulator([]);
    }).toThrowError('Array of supported extensions must not be empty');
  });

  it('should get proper collection name from directory name', () => {
    const collectionPopulator = new CollectionPopulator(['js']);
    const camelCaseName = 'TestCollection';
    const dashCaseName = 'collection-name';
    const testCases: Array<{ name: string; expected: string }> = [
      {
        name: camelCaseName,
        expected: camelCaseName,
      },
      {
        name: `1-${camelCaseName}`,
        expected: camelCaseName,
      },
      {
        name: `4_${camelCaseName}`,
        expected: camelCaseName,
      },
      {
        name: `2.${camelCaseName}`,
        expected: camelCaseName,
      },
      {
        name: `5 ${camelCaseName}`,
        expected: camelCaseName,
      },
      {
        name: `test-${dashCaseName}`,
        expected: `test-${dashCaseName}`,
      },
      {
        name: `32-${dashCaseName}`,
        expected: dashCaseName,
      },
      {
        name: `23 ${dashCaseName}`,
        expected: dashCaseName,
      },
      {
        name: `1_${dashCaseName}`,
        expected: dashCaseName,
      },
      {
        name: '23232',
        expected: '23232',
      },
    ];

    for (const testCase of testCases) {
      // @ts-ignore
      const result = collectionPopulator.getCollectionName(testCase.name);
      expect(result).toBe(testCase.expected);
    }
  });
});
