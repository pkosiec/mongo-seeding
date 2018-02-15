import { Database } from '../database';
import { CollectionToImport, log } from '../common';

export class DataImporter {
  constructor(public db: Database) {}

  async import(collections: CollectionToImport[]) {
    for (const collection of collections) {
      await this.importCollection(collection);
    }
  }

  async importCollection(collection: CollectionToImport) {
    log(
      `Inserting ${collection.documents.length} documents into collection ${
        collection.name
      }...`,
    );
    return this.db.insertDocumentsIntoCollection(
      collection.documents,
      collection.name,
    );
  }
}
