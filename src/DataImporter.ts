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
  static FILE_NAME_SPLIT_CHARACTER = '.';

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

      await this.importCollection(
        collection.name,
        collection.directoryPath,
        config,
      );
    }
  };

  importCollection = async (
    collectionName: string,
    collectionPath: string,
    config: AppConfig,
  ) => {
    const fileNames = readdirSync(collectionPath) || [];
    const documentFileNames = this.getSupportedDocumentFileNames(
      fileNames,
      config.supportedExtensions,
    );

    this.log(`Inserting documents into collection ${collectionName}...`);

    const documentsContentArray = this.getDocumentsContentArray(
      collectionPath,
      documentFileNames,
    );

    const documentsToInsert = config.convertId
      ? this.replaceDocumentIdWithUnderscoreId(documentsContentArray)
      : documentsContentArray;
    this.insertDocumentsIntoCollection(documentsToInsert, collectionName);
  };

  getExistingDbCollectionsArray = async () => {
    return await this.db.listCollections().toArray();
  };

  createCollection = async (collectionName: string) => {
    await this.db.createCollection(collectionName);
  };

  getCollectionImportData = (
    inputDirectory: string,
    existingCollections: string[] = [],
  ): CollectionToImport[] => {
    const collectionsDirectories = this.getDirectories(inputDirectory);
    const collectionsToImport = collectionsDirectories.map(
      collectionDirectory => {
        const collectionName = this.getCollectionName(collectionDirectory);

        return {
          name: collectionName,
          shouldCreate: this.shouldCreateCollection(
            collectionName,
            existingCollections,
          ),
          directoryName: collectionDirectory,
          directoryPath: `${inputDirectory}/${collectionDirectory}`,
        };
      },
    );

    return collectionsToImport;
  };

  shouldCreateCollection = (
    collection: string,
    existingCollections: string[] = [],
  ) => {
    return existingCollections.indexOf(collection) === -1;
  };

  insertDocumentsIntoCollection = async (
    documentsToInsert: any[],
    collectionName: string,
  ) => {
    await this.db.collection(collectionName).insertMany(documentsToInsert);
  };

  getDocumentsContentArray = (
    collectionPath: string,
    documentFileNames: string[],
  ) => {
    const documentsContentArray = documentFileNames.reduce<any[]>(
      (arr: any[], documentFileName) => {
        const documentPath = `${collectionPath}/${documentFileName}`;
        const document: any = require(documentPath);
        return arr.concat(document);
      },
      [],
    );

    return documentsContentArray;
  };

  getSupportedDocumentFileNames = (
    fileNames: string[],
    supportedExtensions: string[],
  ) => {
    const documentFileNames = fileNames.filter(fileName => {
      const fileNameSplit = fileName.split(
        DataImporter.FILE_NAME_SPLIT_CHARACTER,
      );
      if (this.shouldIgnoreFile(fileNameSplit)) {
        return false;
      }

      const fileExtension = fileNameSplit.pop()!;
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
