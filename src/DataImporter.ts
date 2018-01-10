import { readdirSync, lstatSync } from 'fs';
import { Db } from 'mongodb';
import { ObjectId } from 'bson';
import { AppConfig } from './config';

export class DataImporter {
  constructor(public db: Db, public log: (message: string) => void) {}

  importData = async (config: AppConfig): Promise<void> => {
    const collectionsDirs = await readdirSync(config.dataPath);
    const collections = await this.db.listCollections().toArray();

    for (const collectionDir of collectionsDirs) {
      // Directory name pattern: {import order}-{collection name}
      // Objective: to ensure correct import order - i.e. 1-categories
      const collectionName = collectionDir.includes('-')
        ? collectionDir.split('-')[1]
        : collectionDir;
      const collectionPath = `${config.dataPath}/${collectionDir}`;
      const stats = await lstatSync(collectionPath);

      if (!stats.isDirectory()) {
        continue;
      }

      await this.createCollectionIfShould(collections, collectionName);
      await this.insertDocuments(collectionName, collectionPath, config);
    }
  };

  createCollectionIfShould = async (
    collections: Array<{ name: string }>,
    collectionName: string,
  ) => {
    if (!collections.some(collection => collection.name === collectionName)) {
      this.log(`Creating collection ${collectionName}...`);
      await this.db.createCollection(collectionName);
    }
  };

  insertDocuments = async (
    collectionName: string,
    collectionPath: string,
    config: AppConfig,
  ) => {
    const fileNames = (await readdirSync(collectionPath)) || [];
    const documentFileNames = fileNames.filter(fileName => {
      const fileNameArray = fileName.split('.');
      if (!fileNameArray || fileNameArray.length <= 1) {
        return false;
      }

      const fileExtension = fileNameArray.pop()!.toLowerCase();
      return config.supportedExtensions.some(
        extension => extension === fileExtension,
      );
    });

    this.log(`Inserting documents into collection ${collectionName}...`);

    const documents = documentFileNames.reduce<any[]>(
      (arr: any[], documentFileName) => {
        const document: any = require(`${collectionPath}/${documentFileName}`);
        return arr.concat(document);
      },
      [],
    );

    const documentsToInsert = config.convertId
      ? this.setProperDocumentId(documents)
      : documents;
    await this.db.collection(collectionName).insertMany(documentsToInsert);
  };

  setProperDocumentId = (documents: Array<{ id: ObjectId }>) => {
    return documents.map(document => {
      const documentToInsert = {
        ...document,
        _id: document.id,
      };

      delete documentToInsert.id;
      return documentToInsert;
    });
  };
}
