import { Database } from '../database';
import { SeederCollection, log } from '../common';

/**
 * Allows to import collections into database.
 */
export class CollectionImporter {
  /**
   * Constructs new `CollectionImporter` instance.
   *
   * @param db Database object
   */
  constructor(public db: Database) {}

  /**
   * Imports multiple collections into database.
   *
   * @param collections Array of collections
   */
  async import(collections: SeederCollection[]) {
    for (const collection of collections) {
      await this.importCollection(collection);
    }
  }

  /**
   * Imports single collection into database.
   *
   * @param collection Collection definition
   */
  private async importCollection(collection: SeederCollection) {
    log(
      `Inserting ${collection.documents.length} documents into collection ${collection.name}...`,
    );
    return this.db.insertDocumentsIntoCollection(
      collection.documents,
      collection.name,
    );
  }
}
