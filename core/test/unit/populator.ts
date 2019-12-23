import { CollectionPopulator } from '../../src/populator';
import { SeederCollection, SeederCollectionMetadata } from '../../src/common';

describe('CollectionPopulator', () => {
  it('should throw an error when passed no supported extensions', () => {
    expect(() => {
      new CollectionPopulator([]);
    }).toThrowError('Array of supported extensions must not be empty');
  });

  it('should get proper collection metadata from directory name', () => {
    const collectionPopulator = new CollectionPopulator(['js']);
    const camelCaseName = 'TestCollection';
    const dashCaseName = 'collection-name';
    const dotCaseName = 'collection.name';
    const testCases: Array<{
      name: string;
      expected: SeederCollectionMetadata;
    }> = [
      {
        name: camelCaseName,
        expected: { name: camelCaseName },
      },
      {
        name: `1-${camelCaseName}`,
        expected: { name: camelCaseName, orderNo: 1 },
      },
      {
        name: `4_${camelCaseName}`,
        expected: { name: camelCaseName, orderNo: 4 },
      },
      {
        name: `2.${camelCaseName}`,
        expected: { name: camelCaseName, orderNo: 2 },
      },
      {
        name: `2.${dotCaseName}`,
        expected: { name: dotCaseName, orderNo: 2 },
      },
      {
        name: `5 ${camelCaseName}`,
        expected: { name: camelCaseName, orderNo: 5 },
      },
      {
        name: `test-${dashCaseName}`,
        expected: { name: `test-${dashCaseName}` },
      },
      {
        name: `32-${dashCaseName}`,
        expected: { name: dashCaseName, orderNo: 32 },
      },
      {
        name: `23 ${dashCaseName}`,
        expected: { name: dashCaseName, orderNo: 23 },
      },
      {
        name: `1_${dashCaseName}`,
        expected: { name: dashCaseName, orderNo: 1 },
      },
      {
        name: '23232',
        expected: { name: '23232' },
      },
      {
        name: '0004-foo',
        expected: { name: 'foo', orderNo: 4 },
      },
    ];

    for (const testCase of testCases) {
      // @ts-ignore
      const result = collectionPopulator.getCollectionMetadata(testCase.name);
      expect(result).toEqual(testCase.expected);
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
