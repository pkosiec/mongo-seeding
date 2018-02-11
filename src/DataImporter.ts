import { ObjectId } from 'mongodb';
import { Database } from './Database';
import { fileSystem } from './FileSystem';
import { AppConfig } from './config';
import { log } from './logger';
import { Collection } from './DataPopulator';

export interface CollectionToImport {
  name: string;
  directoryName: string;
  directoryPath: string;
  shouldCreate: boolean;
}

export class DataImporter {
  // static DIRECTORY_NAME_PATTERN_SEPARATOR = '-';

  constructor(public db: Database) {}

  async import(collections: Collection[]) {
    for (const collection of collections) {
      await this.importCollection(collection);
    }
  }

  async importCollection(collection: Collection) {
    this.db.insertDocumentsIntoCollection(
      collection.documents,
      collection.name,
    );
  }

  // async importData(config: AppConfig): Promise<void> {
  //   const inputDirectory = config.dataPath;
  //   const existingCollections = await this.db.listExistingCollections();
  //   const collectionsToImport = this.populateCollectionsToImport(
  //     inputDirectory,
  //     existingCollections,
  //   );

  //   for (const collection of collectionsToImport) {
  //     if (collection.shouldCreate) {
  //       log(`Creating collection '${collection.name}'...`);
  //       await this.db.createCollection(collection.name);
  //     }

  //     await this.importCollection(
  //       collection.name,
  //       collection.directoryPath,
  //       config,
  //     );
  //   }
  // }

  // populateCollectionsToImport(
  //   inputDirectory: string,
  //   existingCollections: string[] = [],
  // ): CollectionToImport[] {
  //   const collectionsDirectories = fileSystem.listValidDirectories(
  //     inputDirectory,
  //   );
  //   const collectionsToImport = collectionsDirectories.map(
  //     collectionDirectory => {
  //       return this.getCollectionToImport(
  //         collectionDirectory,
  //         existingCollections,
  //         inputDirectory,
  //       );
  //     },
  //   );

  //   return collectionsToImport;
  // }

  // async importCollection(
  //   collectionName: string,
  //   collectionPath: string,
  //   config: AppConfig,
  // ) {
  //   const fileNames = fileSystem.listFileNames(collectionPath);

  //   if (fileNames.length === 0) {
  //     log(`Directory '${collectionPath}' is empty. Skipping...`);
  //     return;
  //   }

  //   const documentFileNames = fileSystem.filterSupportedDocumentFileNames(
  //     fileNames,
  //     config.supportedExtensions,
  //   );

  //   if (documentFileNames.length === 0) {
  //     log(`No documents found for collection '${collectionName}'. Skipping...`);
  //     return;
  //   }

  //   log(`Inserting documents into collection '${collectionName}'...`);
  //   const documentPaths = documentFileNames.map(
  //     fileName => `${collectionName}/${fileName}`,
  //   );
  //   const documentsContentArray = fileSystem.readFilesContent(documentPaths);

  //   const documentsToInsert = config.replaceIdWithUnderscoreId
  //     ? this.replaceDocumentIdWithUnderscoreId(documentsContentArray)
  //     : documentsContentArray;
  //   this.db.insertDocumentsIntoCollection(documentsToInsert, collectionName);
  // }

  // getCollectionToImport(
  //   collectionDirectory: string,
  //   existingCollections: string[],
  //   inputDirectory: string,
  // ): CollectionToImport {
  //   const collectionName = this.getCollectionName(collectionDirectory);
  //   return {
  //     name: collectionName,
  //     shouldCreate: this.shouldCreateCollection(
  //       collectionName,
  //       existingCollections,
  //     ),
  //     directoryName: collectionDirectory,
  //     directoryPath: `${inputDirectory}/${collectionDirectory}`,
  //   };
  // }

  // shouldCreateCollection(
  //   collection: string,
  //   existingCollections: string[] = [],
  // ) {
  //   return existingCollections.indexOf(collection) === -1;
  // }

  // getCollectionName(directoryName: string) {
  //   // Directory name pattern: {import order}-{collection name}
  //   // TODO: Use Regex and allow more separators
  //   let collectionName;

  //   if (directoryName.includes(DataImporter.DIRECTORY_NAME_PATTERN_SEPARATOR)) {
  //     collectionName = directoryName.split(
  //       DataImporter.DIRECTORY_NAME_PATTERN_SEPARATOR,
  //     )[1];
  //   } else {
  //     collectionName = directoryName;
  //   }

  //   return collectionName;
  // }

  // replaceDocumentIdWithUnderscoreId(
  //   documents: Array<{ id?: string | ObjectId }>,
  // ) {
  //   return documents.map(document => {
  //     if (typeof document.id === 'undefined') {
  //       return document;
  //     }

  //     const documentToInsert = {
  //       ...document,
  //       _id: document.id,
  //     };

  //     delete documentToInsert.id;
  //     return documentToInsert;
  //   });
  // }
}
