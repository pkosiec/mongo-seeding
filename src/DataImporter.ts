import { readdir, lstat } from 'fs-extra';
import { Db } from 'mongodb';
import { ObjectId } from 'bson';
import { SUPPORTED_EXTENSIONS, LOG_TAG, AppConfig } from './config';

export class DataImporter {
  constructor(
    public db: Db,
    public debugLogging: boolean,
    readonly TAG: string,
  ) {}

  importData = async (config: AppConfig): Promise<void> => {
    const collectionsDirs = await readdir(config.dataPath);
    const collections = await this.db.listCollections().toArray();

    for (const collectionDir of collectionsDirs) {
      // Directory name pattern: {import order}-{collection name}
      // Objective: to ensure correct import order - i.e. 1-categories
      const collectionName = collectionDir.includes('-')
        ? collectionDir.split('-')[1]
        : collectionDir;
      const collectionPath = `${config.dataPath}/${collectionDir}`;
      const stats = await lstat(collectionPath);

      if (!stats.isDirectory()) {
        continue;
      }

      await this.createCollectionIfShould(collections, collectionName);
      await this.insertDocuments(
        collectionName,
        collectionPath,
        config.convertId,
      );
    }
  };

  createCollectionIfShould = async (
    collections: Array<{ name: string }>,
    collectionName: string,
  ) => {
    if (!collections.some(collection => collection.name === collectionName)) {
      this.debugLogging &&
        console.log(this.TAG, `Creating collection ${collectionName}...`);
      await this.db.createCollection(collectionName);
    }
  };

  insertDocuments = async (
    collectionName: string,
    collectionPath: string,
    convertId: boolean,
  ) => {
    const fileNames = (await readdir(collectionPath)) || [];
    const documentFileNames = fileNames.filter(fileName => {
      const fileNameArray = fileName.split('.');
      if (!fileNameArray || fileNameArray.length <= 1) {
        return false;
      }

      const fileExtension = fileNameArray.pop()!.toLowerCase();
      return SUPPORTED_EXTENSIONS.some(
        extension => extension === fileExtension,
      );
    });

    this.debugLogging &&
      console.log(
        this.TAG,
        `Inserting documents into collection ${collectionName}...`,
      );

    const documents = documentFileNames.reduce<any[]>(
      (arr: any[], documentFileName) => {
        const document: any = require(`${collectionPath}/${documentFileName}`);
        return arr.concat(document);
      },
      [],
    );

    const documentsToInsert = convertId
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
