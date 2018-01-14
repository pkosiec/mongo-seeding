import { readdirSync } from 'fs';

import { DataImporter } from '../src/DataImporter';
import { Database } from '../src/Database';

const dataImporter = new DataImporter(
  new Database(jest.genMockFromModule('mongodb')),
);

describe('Processing data', () => {
  it('should get proper collection name from directory name', () => {
    const testCollectionName = 'test collection';

    const collectionWithoutNumber = dataImporter.getCollectionName(
      testCollectionName,
    );
    expect(collectionWithoutNumber).toBe(testCollectionName);

    const collectionWithDashSeparator = dataImporter.getCollectionName(
      `1-${testCollectionName}`,
    );
    expect(collectionWithDashSeparator).toBe(testCollectionName);

    //TODO: New feature: handle multiple separators
    // const collectionWithDotSeparator = dataImporter.getCollectionName(
    //   `1.${testCollectionName}`,
    // );
    // expect(collectionWithDotSeparator).toBe(testCollectionName);

    // const collectionWithUnderscoreSeparator = dataImporter.getCollectionName(
    //   `1_${testCollectionName}`,
    // );
    // expect(collectionWithUnderscoreSeparator).toBe(testCollectionName);

    const collectionWithNumberName = dataImporter.getCollectionName(`1`);
    expect(collectionWithNumberName).toBe('1');
  });

  it('should create collection only it does not exist', () => {
    const collection = 'testing';
    const existingCollections = ['just', 'a', 'simple', 'test'];
    const shouldCreateTestingCollection = dataImporter.shouldCreateCollection(
      'testing',
      existingCollections,
    );
    expect(shouldCreateTestingCollection).toBeTruthy();

    const shouldCreateTestCollection = dataImporter.shouldCreateCollection(
      'test',
      existingCollections,
    );
    expect(shouldCreateTestCollection).toBeFalsy();
  });

  it('should replace document `id` field with `_id`', () => {
    const documents = [
      { id: 'id_1', name: 'Test 1', value: 1 },
      { id: '3442', name: 'Test 2', value: 2 },
      { id: '3_id', name: 'Test 3', value: 3 },
    ];
    const newDocuments = dataImporter.replaceDocumentIdWithUnderscoreId(
      documents,
    );
    expect(newDocuments).toEqual([
      { _id: 'id_1', name: 'Test 1', value: 1 },
      { _id: '3442', name: 'Test 2', value: 2 },
      { _id: '3_id', name: 'Test 3', value: 3 },
    ]);
  });
});
