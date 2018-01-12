import { DataImporter } from '../src/DataImporter';

import { Db } from 'mongodb';
import { readdirSync } from 'fs';

const dataImporter = new DataImporter(null, jest.fn(() => {}));

describe('Reading files', () => {
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

  it('should filter supported documents from all files in directory', () => {
    const fileNames = [
      '.README.md',
      'dist',
      'file1.json',
      'file2.js',
      'release.sh',
      'data-import.js',
    ];
    const supportedExtensions = ['js', 'json'];
    const supportedDocuments = dataImporter.getSupportedDocumentFileNames(
      fileNames,
      supportedExtensions,
    );
    expect(supportedDocuments).toEqual([
      'file1.json',
      'file2.js',
      'data-import.js',
    ]);
  });

  it('should recognize hidden or files with no extension', () => {
    const ignoreFile = dataImporter.shouldIgnoreFile(
      'test.extension'.split('.'),
    );
    expect(ignoreFile).toBeFalsy();

    const ignoreHiddenFile = dataImporter.shouldIgnoreFile(
      '.test.js'.split('.'),
    );
    expect(ignoreHiddenFile).toBeTruthy();

    const ignoreFileWithNoExtension = dataImporter.shouldIgnoreFile(
      'test'.split('.'),
    );
    expect(ignoreFileWithNoExtension).toBeTruthy();

    const ignoreHiddenFileWithNoExtension = dataImporter.shouldIgnoreFile(
      '.test'.split('.'),
    );
    expect(ignoreHiddenFileWithNoExtension).toBeTruthy();
  });
});

jest.mock('mockFiles/test1.json', () => ({ number: 1 }), { virtual: true });
jest.mock(
  'mockFiles/test2.js',
  () => ({
    value: {
      second: true,
    },
  }),
  { virtual: true },
);
jest.mock('mockFiles/test3.json', () => ({ string: 'three' }), {
  virtual: true,
});

describe('Processing data', () => {
  it('should create collection only it does not exist', () => {
    const collection = 'testing';
    const existingCollections = ['just', 'a', "simple", 'test'];
    const shouldCreateTestingCollection = dataImporter.shouldCreateCollection(
      "testing",
      existingCollections,
    );
    expect(shouldCreateTestingCollection).toBeTruthy();
    
    const shouldCreateTestCollection = dataImporter.shouldCreateCollection(
      "test",
      existingCollections,
    );
    expect(shouldCreateTestCollection).toBeFalsy();
  });

  it('should get documents content array from array of file names', () => {
    const documentFileNames = ['test1.json', 'test2.js', 'test3.json'];
    const contentArray = dataImporter.getDocumentsContentArray(
      'mockFiles',
      documentFileNames,
    );

    expect(contentArray).toEqual([
      {
        number: 1,
      },
      {
        value: {
          second: true,
        },
      },
      {
        string: 'three',
      },
    ]);
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
