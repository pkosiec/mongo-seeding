import { Db } from 'mongodb';
import { log } from './logger';

export class Database {
  constructor(public db: Db) {}

  async drop() {
    log('Dropping database...');
    await this.db.dropDatabase();
  }

  async getExistingCollectionsArray() {
    return await this.db.listCollections().toArray();
  }

  async createCollection(collectionName: string) {
    await this.db.createCollection(collectionName);
  }

  async insertDocumentsIntoCollection(
    documentsToInsert: any[],
    collectionName: string,
  ) {
    await this.db.collection(collectionName).insertMany(documentsToInsert);
  }

  async closeConnection() {
    log('Closing connection...');
    await this.db.close();
  }
}
