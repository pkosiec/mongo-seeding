import { readdirSync, lstatSync } from 'fs';
import { Db } from 'mongodb';
import { ObjectId } from 'bson';
import { AppConfig } from './config';

export interface CollectionToImport {
  name: string;
  directoryName: string;
  directoryPath: string;
  shouldCreate: boolean;
}

export class DataImporter {
  static DIRECTORY_NAME_PATTERN_SEPARATOR = '-';

  constructor(public db: Db, public log: (message: string) => void) {}

  importData = async (config: AppConfig): Promise<void> => {
    const inputDirectory = config.dataPath;
    const existingCollections = await this.getExistingDbCollectionsArray();
    const collectionsToImport = this.getCollectionImportData(
      inputDirectory,
      existingCollections,
    );

    for (const collection of collectionsToImport) {
      if (collection.shouldCreate) {
        this.log(`Creating collection ${collection.name}...`);
        await this.createCollection(collection.name);
      }

      await this.insertDocuments(
        collection.name,
        collection.directoryPath,
        config,
      );
    }
  };

  getExistingDbCollectionsArray = async () => {
    return await this.db.listCollections().toArray();
  };

  getCollectionImportData = (
    inputDirectory: string,
    existingCollections: string[] = [],
  ): CollectionToImport[] => {
    const collectionsDirectories = this.getDirectories(inputDirectory);
    const collectionsToImport = collectionsDirectories.map(
      collectionDirectory => {
        const collectionName = this.getCollectionName(collectionDirectory);
        const shouldCreate = existingCollections.indexOf(collectionName) === -1;

        return {
          directoryName: collectionDirectory,
          directoryPath: `${inputDirectory}/${collectionDirectory}`,
          name: collectionName,
          shouldCreate,
        };
      },
    );

    return collectionsToImport;
  };

  createCollection = async (collectionName: string) => {
    await this.db.createCollection(collectionName);
  };

  insertDocuments = async (
    collectionName: string,
    collectionPath: string,
    config: AppConfig,
  ) => {
    const documentFileNames = this.getSupportedDocumentFileNames(
      collectionPath,
      config.supportedExtensions,
    );

    this.log(`Inserting documents into collection ${collectionName}...`);

    const documentsContentArray = this.getDocumentsContentArray(
      documentFileNames,
      collectionPath,
    );

    const documentsToInsert = config.convertId
      ? this.replaceDocumentIdWithUnderscoreId(documentsContentArray)
      : documentsContentArray;
    this.insertDocumentsIntoCollection(documentsToInsert, collectionName);
  };

  insertDocumentsIntoCollection = async (
    documentsToInsert: any[],
    collectionName: string,
  ) => {
    await this.db.collection(collectionName).insertMany(documentsToInsert);
  };

  getDocumentsContentArray = (
    documentFileNames: string[],
    collectionPath: string,
  ) => {
    const documentsContentArray = documentFileNames.reduce<any[]>(
      (arr: any[], documentFileName) => {
        const document: any = require(`${collectionPath}/${documentFileName}`);
        return arr.concat(document);
      },
      [],
    );

    return documentsContentArray;
  };

  getSupportedDocumentFileNames = (
    path: string,
    supportedExtensions: string[],
  ) => {
    const fileNames = readdirSync(path) || [];
    const documentFileNames = fileNames.filter(fileName => {
      const fileNameSplitByDot = fileName.split('.');
      if (this.shouldIgnoreFile(fileNameSplitByDot)) {
        return false;
      }

      const fileExtension = fileNameSplitByDot.pop()!;
      return supportedExtensions.some(
        extension => extension.toLowerCase() === fileExtension.toLowerCase(),
      );
    });

    return documentFileNames;
  };

  shouldIgnoreFile = (fileNameSplitByDot: string[]) => {
    const isHidden = !fileNameSplitByDot[0];
    const hasNoExtension = fileNameSplitByDot.length === 1;

    return isHidden || hasNoExtension;
  };

  getDirectories = (inputDirectory: string) => {
    const filesAndDirectories = readdirSync(inputDirectory);
    const directories = filesAndDirectories.filter(fileOrDirectory =>
      this.isDirectory(`${inputDirectory}/${fileOrDirectory}`),
    );
    return directories;
  };

  isDirectory = (collectionPath: string) => {
    const stats = lstatSync(collectionPath);
    return stats.isDirectory();
  };

  getCollectionName = (directoryName: string) => {
    // Directory name pattern: {import order}-{collection name}
    // Objective: to ensure correct import order - i.e. 1-categories
    let collectionName;
    if (directoryName.includes(DataImporter.DIRECTORY_NAME_PATTERN_SEPARATOR)) {
      collectionName = directoryName.split(
        DataImporter.DIRECTORY_NAME_PATTERN_SEPARATOR,
      )[1];
    } else {
      collectionName = directoryName;
    }

    return collectionName;
  };

  replaceDocumentIdWithUnderscoreId = (
    documents: Array<{ id: string | ObjectId }>,
  ) => {
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
