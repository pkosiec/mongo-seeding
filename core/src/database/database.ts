import { Db } from 'mongodb';

/**
 * Provides functionality for managing documents, collections in database.
 */
export class Database {
  /**
   * Constructs a new `Database` object.
   *
   * @param db MongoDB database object
   */
  constructor(public db: Db) {}

  /**
   * Inserts documents into a given collection.
   *
   * @param documentsToInsert Array of documents, which are being imported
   * @param collectionName Collection name
   */
  async insertDocumentsIntoCollection(
    documentsToInsert: any[],
    collectionName: string,
  ) {
    const documentsCopy = documentsToInsert.map(document => ({ ...document }));
    return this.db.collection(collectionName).insertMany(documentsCopy);
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
      .map(collection => collection.collectionName)
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
}
