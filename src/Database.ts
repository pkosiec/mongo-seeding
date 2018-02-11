import { Db } from 'mongodb';
import { log } from './logger';

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
    log('Dropping database...');
    await this.db.dropDatabase();
  }
}
