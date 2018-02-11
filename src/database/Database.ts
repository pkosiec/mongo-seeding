import { Db } from 'mongodb';

export class Database {
  constructor(public db: Db) {}

  async insertDocumentsIntoCollection(
    documentsToInsert: any[],
    collectionName: string,
  ) {
    const documentsCopy = documentsToInsert.map(document => ({ ...document }));
    await this.db.collection(collectionName).insertMany(documentsCopy);
  }

  async drop() {
    await this.db.dropDatabase();
  }
}
