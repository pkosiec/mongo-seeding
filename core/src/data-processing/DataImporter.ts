import { Database } from '../database';
import { Collection, log } from '../common';

export class DataImporter {
  constructor(public db: Database) {}

  async import(collections: Collection[]) {
    for (const collection of collections) {
      await this.importCollection(collection);
    }
  }

  async importCollection(collection: Collection) {
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
