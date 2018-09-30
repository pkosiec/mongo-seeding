import { CollectionPopulator } from '../../src/populator';

describe('CollectionPopulator', () => {
  it('should throw an error when passed no supported extensions', () => {
    expect(() => {
      new CollectionPopulator([]);
    }).toThrowError('Array of supported extensions must not be empty');
  });

  it('should get proper collection name from directory name', () => {
    const collectionPopulator = new CollectionPopulator(['js']);
    const collectionName = 'TestCollection';
    const collectionNumberName = '1';

    const testCases: Array<{ name: string; expected: string }> = [
      {
        name: collectionName,
        expected: collectionName,
      },
      {
        name: `1-${collectionName}`,
        expected: collectionName,
      },
      {
        name: `1_${collectionName}`,
        expected: collectionName,
      },
      {
        name: `1.${collectionName}`,
        expected: collectionName,
      },
      {
        name: `1 ${collectionName}`,
        expected: collectionName,
      },
      {
        name: collectionNumberName,
        expected: collectionNumberName,
      },
    ];

    for (const testCase of testCases) {
      // @ts-ignore
      const result = collectionPopulator.getCollectionName(testCase.name);
      expect(result).toBe(testCase.expected);
    }
  });
});
