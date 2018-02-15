import { DataPopulator } from '../../src/data-processing';

describe('DataPopulator', () => {
  it('should throw an error when passed no supported extensions', () => {
    expect(() => {
      return new DataPopulator([]);
    }).toThrow('Array of supported extensions must not be empty');
  });

  it('should get proper collection name from directory name', () => {
    const dataPopulator = new DataPopulator([]);
    const testCollectionName = 'TestCollection';

    const collectionWithoutNumber = dataPopulator.getCollectionName(
      testCollectionName,
    );
    const collectionWithDashSeparator = dataPopulator.getCollectionName(
      `1-${testCollectionName}`,
    );
    const collectionWithNumberName = dataPopulator.getCollectionName(`1`);

    expect(collectionWithoutNumber).toBe(testCollectionName);
    expect(collectionWithDashSeparator).toBe(testCollectionName);
    expect(collectionWithNumberName).toBe('1');
  });
});
