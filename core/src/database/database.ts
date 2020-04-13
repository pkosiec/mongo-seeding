import { Db, CollectionInsertManyOptions, MongoClient } from 'mongodb';
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
   * @param db MongoDB database object
   */
  constructor(mongoClient: MongoClient, log?: LogFn) {
    this.client = mongoClient;
    this.db = mongoClient.db();
    this.log = log ? log : () => {};
  }

  /**
   * Inserts documents into a given collection.
   *
   * @param documentsToInsert Array of documents, which are being imported
   * @param collectionName Collection name
   * @param collectionInsertOptions Optional collection import options
   */
  async insertDocumentsIntoCollection(
    documentsToInsert: any[],
    collectionName: string,
    collectionInsertOptions?: CollectionInsertManyOptions,
  ) {
    const documentsCopy = documentsToInsert.map((document) => ({
      ...document,
    }));
    return this.db
      .collection(collectionName)
      .insertMany(documentsCopy, collectionInsertOptions);
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
   * Closes connection with database.
   */
  async closeConnection() {
    this.log('Closing connection...');
    if (!this.client || !this.client.isConnected()) {
      return;
    }

    await this.client.close(true);
  }
}
