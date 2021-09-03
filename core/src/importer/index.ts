import { Database } from '../database';
import { SeederCollection, LogFn } from '../common';

/**
 * Allows to import collections into database.
 */
export class CollectionImporter {
  /**
   * Wrapper for MongoDB database
   */
  db: Database;

  /**
   * Logger instance
   */
  log: LogFn;

  /**
   * Constructs new `CollectionImporter` instance.
   *
   * @param db Database object
   * @param collectionInsertManyOptions Optional MongoDB Collection InsertMany Options
   */
  constructor(db: Database, log?: LogFn) {
    this.db = db;
    this.log = log ? log : () => {};
  }

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
    this.log(
      `Inserting ${collection.documents.length} documents into collection ${collection.name}...`,
    );
    return this.db.insertDocumentsIntoCollection(
      collection.documents,
      collection.name,
    );
  }
}
