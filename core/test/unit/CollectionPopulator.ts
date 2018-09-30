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

    const collectionWithoutNumber = collectionPopulator.getCollectionName(
      collectionName,
    );
    const collectionWithDash = collectionPopulator.getCollectionName(
      `1-${collectionName}`,
    );
    const collectionWithUnderscore = collectionPopulator.getCollectionName(
      `1_${collectionName}`,
    );
    const collectionWithDot = collectionPopulator.getCollectionName(
      `1.${collectionName}`,
    );
    const collectionWithSpace = collectionPopulator.getCollectionName(
      `1 ${collectionName}`,
    );
    const collectionWithNumberName = collectionPopulator.getCollectionName(
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
