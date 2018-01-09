import { DataImporter } from '../src/DataImporter';

import { Db } from 'mongodb';

const dataImporter = new DataImporter(null, jest.fn(() => {}));

describe('Reading files', () => {
  it('should filter directories from all files and subdirectories', () => {
    //TODO
  });

  it('should filter supported documents from all files in directory', () => {
    //TODO
  })

  it('should get documents content array from array of file names', () => {
    //TODO
  });

});

describe('Processing data', () => {


  it('should ignore hidden or files with no extension', () => {
    //TODO
  });


  it('should get proper collection name from directory name', () => {
    //TODO
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
    expect(newDocuments).toEqual(
      expect.arrayContaining([
        { _id: 'id_1', name: 'Test 1', value: 1 },
        { _id: '3442', name: 'Test 2', value: 2 },
        { _id: '3_id', name: 'Test 3', value: 3 },
      ]),
    );
  });
});

describe('Database operations', () => {

  it('should get existing collections from database', () => {
    //TODO
  });
  
  it('should create collection with given name', () => {
    //TODO
  });

  it('should insert documents into database', () => {
    //TODO
  });
});
