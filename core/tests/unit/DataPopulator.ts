import { DataPopulator } from '../../src/data-processing';

describe('DataPopulator', () => {
  it('should throw an error when passed no supported extensions', () => {
    expect(() => {
      new DataPopulator([]);
    }).toThrowError('Array of supported extensions must not be empty');
  });

  it('should get proper collection name from directory name', () => {
    const dataPopulator = new DataPopulator(['js']);
    const collectionName = 'TestCollection';
    const collectionNumberName = '1';

    const collectionWithoutNumber = dataPopulator.getCollectionName(
      collectionName,
    );
    const collectionWithDash = dataPopulator.getCollectionName(
      `1-${collectionName}`,
    );
    const collectionWithUnderscore = dataPopulator.getCollectionName(
      `1_${collectionName}`,
    );
    const collectionWithDot = dataPopulator.getCollectionName(
      `1.${collectionName}`,
    );
    const collectionWithSpace = dataPopulator.getCollectionName(
      `1 ${collectionName}`,
    );
    const collectionWithNumberName = dataPopulator.getCollectionName(
      collectionNumberName,
    );

    expect(collectionWithoutNumber).toBe(collectionName);
    expect(collectionWithDash).toBe(collectionName);
    expect(collectionWithUnderscore).toBe(collectionName);
    expect(collectionWithDot).toBe(collectionName);
    expect(collectionWithSpace).toBe(collectionName);
    expect(collectionWithNumberName).toBe(collectionNumberName);
  });
});
