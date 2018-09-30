import { Db } from 'mongodb';

export class Database {
  constructor(public db: Db) {}

  async insertDocumentsIntoCollection(
    documentsToInsert: any[],
    collectionName: string,
  ) {
    const documentsCopy = documentsToInsert.map(document => ({ ...document }));
    return this.db.collection(collectionName).insertMany(documentsCopy);
  }

  async drop() {
    return this.db.dropDatabase();
  }

  async ifCollectionExist(collectionName: string): Promise<boolean> {
    const collections = await this.db.collections();
    return collections
      .map(collection => collection.collectionName)
      .includes(collectionName);
  }

  async dropCollectionIfExists(collectionName: string) {
    if (!(await this.ifCollectionExist(collectionName))) {
      return;
    }

    return this.db.collection(collectionName).drop();
  }
}
