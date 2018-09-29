import { Database } from '../database';
import { SeederCollection, log } from '../common';

export class CollectionImporter {
  constructor(public db: Database) {}

  async import(collections: SeederCollection[]) {
    for (const collection of collections) {
      await this.importCollection(collection);
    }
  }

  async importCollection(collection: SeederCollection) {
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
