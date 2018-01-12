import { ObjectId } from 'mongodb';
import { readdirSync, lstatSync } from 'fs';
import { Database } from './Database';
import { AppConfig } from './config';
import { log } from './logger';

export interface CollectionToImport {
  name: string;
  directoryName: string;
  directoryPath: string;
  shouldCreate: boolean;
}

export class DataImporter {
  static DIRECTORY_NAME_PATTERN_SEPARATOR = '-';
  static FILE_NAME_SPLIT_CHARACTER = '.';

  constructor(public db: Database) {}

  async importData(config: AppConfig): Promise<void> {
    const inputDirectory = config.dataPath;
    const existingCollections = await this.db.getExistingCollectionsArray();
    const collectionsToImport = this.getCollectionsToImport(
      inputDirectory,
      existingCollections,
    );

    for (const collection of collectionsToImport) {
      if (collection.shouldCreate) {
        log(`Creating collection ${collection.name}...`);
        await this.db.createCollection(collection.name);
      }

      await this.importCollection(
        collection.name,
        collection.directoryPath,
        config,
      );
    }
  }

  getCollectionsToImport(
    inputDirectory: string,
    existingCollections: string[] = [],
  ): CollectionToImport[] {
    const collectionsDirectories = this.getDirectories(inputDirectory);
    const collectionsToImport = collectionsDirectories.map(
      collectionDirectory => {
        return this.getCollectionToImport(
          collectionDirectory,
          existingCollections,
          inputDirectory,
        );
      },
    );

    return collectionsToImport;
  }

  async importCollection(
    collectionName: string,
    collectionPath: string,
    config: AppConfig,
  ) {
    const fileNames = readdirSync(collectionPath) || [];
    const documentFileNames = this.getSupportedDocumentFileNames(
      fileNames,
      config.supportedExtensions,
    );

    log(`Inserting documents into collection ${collectionName}...`);

    const documentsContentArray = this.getDocumentsContentArray(
      collectionPath,
      documentFileNames,
    );

    const documentsToInsert = config.convertId
      ? this.replaceDocumentIdWithUnderscoreId(documentsContentArray)
      : documentsContentArray;
    this.db.insertDocumentsIntoCollection(documentsToInsert, collectionName);
  }

  getCollectionToImport(
    collectionDirectory: string,
    existingCollections: string[],
    inputDirectory: string,
  ): CollectionToImport {
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
  }

  shouldCreateCollection(
    collection: string,
    existingCollections: string[] = [],
  ) {
    return existingCollections.indexOf(collection) === -1;
  }

  getDocumentsContentArray(
    collectionPath: string,
    documentFileNames: string[],
  ) {
    const documentsContentArray = documentFileNames.reduce<any[]>(
      (arr: any[], documentFileName) => {
        const documentPath = `${collectionPath}/${documentFileName}`;
        const document: any = require(documentPath);
        return arr.concat(document);
      },
      [],
    );

    return documentsContentArray;
  }

  getSupportedDocumentFileNames(
    fileNames: string[],
    supportedExtensions: string[],
  ) {
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
  }

  shouldIgnoreFile(fileNameSplitByDot: string[]) {
    const isHidden = !fileNameSplitByDot[0];
    const hasNoExtension = fileNameSplitByDot.length === 1;
    return isHidden || hasNoExtension;
  }

  getDirectories(inputDirectory: string) {
    const filesAndDirectories = readdirSync(inputDirectory);
    const directories = filesAndDirectories.filter(fileOrDirectory =>
      this.isDirectory(`${inputDirectory}/${fileOrDirectory}`),
    );
    return directories;
  }

  isDirectory(collectionPath: string) {
    const stats = lstatSync(collectionPath);
    return stats.isDirectory();
  }

  getCollectionName(directoryName: string) {
    // Directory name pattern: {import order}-{collection name}
    // TODO: Use Regex and allow more separators
    let collectionName;

    if (directoryName.includes(DataImporter.DIRECTORY_NAME_PATTERN_SEPARATOR)) {
      collectionName = directoryName.split(
        DataImporter.DIRECTORY_NAME_PATTERN_SEPARATOR,
      )[1];
    } else {
      collectionName = directoryName;
    }

    return collectionName;
  }

  replaceDocumentIdWithUnderscoreId(
    documents: Array<{ id: string | ObjectId }>,
  ) {
    return documents.map(document => {
      const documentToInsert = {
        ...document,
        _id: document.id,
      };

      delete documentToInsert.id;
      return documentToInsert;
    });
  }
}
