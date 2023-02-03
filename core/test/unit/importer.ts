import { CollectionImporter } from '../../src/importer';
import { Database } from '../../src/database';
import { BulkWriteOptions } from 'mongodb';
import { SeederCollection } from '../../src/common';

describe('Collection Importer', () => {
  it('allows passing custom import options', () => {
    const collection: SeederCollection = { name: 'test', documents: [] };
    const db = jest.genMockFromModule<Database>('../../src/database');

    db.insertDocumentsIntoCollection = jest.fn();

    const opts: BulkWriteOptions = {
      ordered: true,
      bypassDocumentValidation: true,
    };
    const importer = new CollectionImporter(db, opts);
    importer.import([collection]);

    // @ts-ignore
    expect(db.insertDocumentsIntoCollection).toBeCalledTimes(1);
    expect(db.insertDocumentsIntoCollection).toBeCalledWith(
      collection.documents,
      collection.name,
      opts,
    );
  });
});
