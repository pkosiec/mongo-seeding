import { readdirSync } from 'fs';

import { DataImporter } from '../../src/DataImporter';
import { Database } from '../../src/Database';

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

  it('should replace document `id` property with `_id`', () => {
    const documents = [
      { id: 'id_1', name: 'Test 1', value: 1 },
      { id: '2_id', name: 'Test 2', value: 2 },
    ];
    const newDocuments = dataImporter.replaceDocumentIdWithUnderscoreId(
      documents,
    );
    expect(newDocuments).toEqual([
      { _id: 'id_1', name: 'Test 1', value: 1 },
      { _id: '2_id', name: 'Test 2', value: 2 },
    ]);
  });

  it('should skip assigning `_id` when `id` property is missing', () => {
    const documents: Array<{ id?: string; name: string; value: number }> = [
      { name: 'Test 1', value: 1 },
    ];
    const newDocuments = dataImporter.replaceDocumentIdWithUnderscoreId(
      documents,
    );
    expect(newDocuments).toEqual([{ name: 'Test 1', value: 1 }]);
  });
});
