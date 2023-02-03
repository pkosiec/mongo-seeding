import { Db, MongoClient, BulkWriteOptions } from 'mongodb';
import { LogFn } from '../common';

/**
 * Provides functionality for managing documents, collections in database.
 */
export class Database {
  /**
   * MongoDB database object
   */
  db: Db;

  /**
   * MongoDB Client.
   */
  client?: MongoClient;

  /**
   * Logger instance
   */
  log: LogFn;

  /**
   * Constructs a new `Database` object.
   *
   * @param mongoClient MongoDB Client
   * @param log Optional logger
   */
  constructor(mongoClient: MongoClient, log?: LogFn) {
    this.client = mongoClient;
    this.db = mongoClient.db();
    this.log = log
      ? log
      : () => {
          // do nothing
        };
  }

  /**
   * Inserts documents into a given collection.
   *
   * @param documentsToInsert Array of documents, which are being imported
   * @param collectionName Collection name
   * @param bulkWriteOptions Optional collection import options
   */
  async insertDocumentsIntoCollection(
    documentsToInsert: object[],
    collectionName: string,
    bulkWriteOptions?: BulkWriteOptions,
  ) {
    const documentsCopy = documentsToInsert.map((document) => ({
      ...document,
    }));
    return this.db
      .collection(collectionName)
      .insertMany(documentsCopy, bulkWriteOptions);
  }

  /**
   * Drops database.
   */
  async drop() {
    return this.db.dropDatabase();
  }

  /**
   * Checks if a given collection exist.
   *
   * @param collectionName Collection name
   */
  async ifCollectionExist(collectionName: string): Promise<boolean> {
    const collections = await this.db.collections();
    return collections
      .map((collection) => collection.collectionName)
      .includes(collectionName);
  }

  /**
   * Drops a given collection if exists.
   *
   * @param collectionName Collection name
   */
  async dropCollectionIfExists(collectionName: string) {
    if (!(await this.ifCollectionExist(collectionName))) {
      return;
    }

    return this.db.collection(collectionName).drop();
  }

  /**
   * Remove all documents from a given collection
   * if it exists.
   *
   * @param collectionName Collection name
   */
  async removeAllDocumentsIfCollectionExists(collectionName: string) {
    if (!(await this.ifCollectionExist(collectionName))) {
      return;
    }

    return this.db.collection(collectionName).deleteMany({});
  }

  /**
   * Closes connection with database.
   */
  async closeConnection() {
    this.log('Closing connection...');
    if (!this.client) {
      return;
    }

    await this.client.close(true);
  }
}
