import { Database } from '../database';
import { SeederCollection, LogFn } from '../common';
import { BulkWriteOptions } from 'mongodb';

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
   * Optional MongoDB collection create options
   */
  bulkWriteOptions?: BulkWriteOptions;

  /**
   * Constructs new `CollectionImporter` instance.
   *
   * @param db Database object
   * @param bulkWriteOptions Optional MongoDB bulk write options
   * @param log Optional logger instance
   */
  constructor(db: Database, bulkWriteOptions?: BulkWriteOptions, log?: LogFn) {
    this.db = db;
    this.bulkWriteOptions = bulkWriteOptions;
    this.log = log
      ? log
      : () => {
          // do nothing
        };
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
      this.bulkWriteOptions,
    );
  }
}
