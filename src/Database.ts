import { Db } from 'mongodb';
import { log } from './logger';

export class Database {
  constructor(public db: Db) {}

  async listExistingCollections(): Promise<string[]> {
    const collections = await this.db.listCollections().toArray();
    return collections.map(collection => collection.name);
  }

  async createCollection(collectionName: string) {
    await this.db.createCollection(collectionName);
  }

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
