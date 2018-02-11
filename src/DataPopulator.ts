import { CollectionToImport } from './types';
import { fileSystem } from './FileSystem';
import { log } from './logger';
import { ObjectId } from 'mongodb';

export class DataPopulator {
  static DIRECTORY_NAME_PATTERN_SEPARATOR = '-';

  populate(
    inputDirectory: string,
    supportedExtensions: string[],
  ): CollectionToImport[] {
    const collectionsDirectories = fileSystem.listValidDirectories(
      inputDirectory,
    );

    return collectionsDirectories.reduce(
      (collections: CollectionToImport[], collectionDirectory: string) => {
        const name = this.getCollectionName(collectionDirectory);
        const relativePath = `${inputDirectory}/${collectionDirectory}`;
        const documents = this.populateDocuments(
          relativePath,
          supportedExtensions,
        );

        if (documents) {
          collections.push({
            name,
            documents,
          });
        }

        return collections;
      },
      [],
    );
  }

  populateDocuments(collectionPath: string, supportedExtensions: string[]) {
    const fileNames = fileSystem.listFileNames(collectionPath);

    if (fileNames.length === 0) {
      log(`Directory '${collectionPath}' is empty. Skipping...`);
      return;
    }

    const documentFileNames = fileSystem.filterSupportedDocumentFileNames(
      fileNames,
      supportedExtensions,
    );

    if (documentFileNames.length === 0) {
      log(
        `No supported files found in directory '${collectionPath}'. Skipping...`,
      );
      return;
    }

    const documentPaths = documentFileNames.map(
      fileName => `${collectionPath}/${fileName}`,
    );

    return fileSystem.readFilesContent(documentPaths);
  }

  getCollectionName(directoryName: string) {
    // Directory name pattern: {import order}-{collection name}
    // TODO: Use Regex and allow more separators
    let collectionName;
    if (
      directoryName.includes(DataPopulator.DIRECTORY_NAME_PATTERN_SEPARATOR)
    ) {
      collectionName = directoryName.split(
        DataPopulator.DIRECTORY_NAME_PATTERN_SEPARATOR,
      )[1];
    } else {
      collectionName = directoryName;
    }
    return collectionName;
  }
}
