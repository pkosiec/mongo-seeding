import { CollectionPopulator } from '../../src/populator';
import { SeederCollection } from '../../src/common';

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

  it('should sort collections', () => {
    const collectionPopulator = new CollectionPopulator(['json']);
    const input: SeederCollection[] = [
      {
        name: 'no-number',
        documents: [],
      },
      {
        name: 'three',
        documents: [],
        orderNo: 3,
      },
      {
        name: 'zero',
        documents: [],
        orderNo: 0,
      },
      {
        name: 'one-hundred',
        orderNo: 100,
        documents: [],
      },
      {
        name: 'one',
        documents: [],
        orderNo: 1,
      },
    ];
    const expectedResult: SeederCollection[] = [
      {
        name: 'zero',
        documents: [],
        orderNo: 0,
      },
      {
        name: 'one',
        documents: [],
        orderNo: 1,
      },
      {
        name: 'three',
        documents: [],
        orderNo: 3,
      },
      {
        name: 'one-hundred',
        orderNo: 100,
        documents: [],
      },
      {
        name: 'no-number',
        documents: [],
      },
    ];

    // @ts-ignore
    const result = collectionPopulator.sortCollections(input);

    expect(result).toStrictEqual(expectedResult);
  });
});
