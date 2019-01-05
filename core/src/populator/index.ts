import { SeederCollection, log } from '../common';
import { fileSystem } from './filesystem';
import { isNumber } from 'util';

export class CollectionPopulator {
  extensions: string[];

  constructor(extensions: string[]) {
    if (extensions.length === 0) {
      throw new Error('Array of supported extensions must not be empty');
    }
    this.extensions = extensions;
  }

  readFromPath(path: string): SeederCollection[] {
    const subdirectories = fileSystem.listValidDirectories(path);
    return this.readCollections(subdirectories, path);
  }

  private readCollections(directories: string[], inputDirectory: string) {
    return directories.reduce(
      (collections: SeederCollection[], directoryName: string) => {
        const relativePath = `${inputDirectory}/${directoryName}`;
        const collection = this.readCollection(relativePath, directoryName);
        if (collection) {
          collections.push(collection);
        }
        return collections;
      },
      [],
    );
  }

  private readCollection(path: string, directoryName: string) {
    const name = this.getCollectionName(directoryName);
    const documents = this.populateDocumentsContent(path);
    if (!documents) {
      return null;
    }

    return {
      name,
      documents,
    };
  }

  private populateDocumentsContent(collectionPath: string) {
    const fileNames = fileSystem.listFileNames(collectionPath);
    if (fileNames.length === 0) {
      log(`Directory '${collectionPath}' is empty. Skipping...`);
      return;
    }

    const documentFileNames = fileSystem.filterSupportedDocumentFileNames(
      fileNames,
      this.extensions,
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

  private getCollectionName(directoryName: string) {
    const separators = /\s*[-_\.\s]\s*/;

    const isMatch = directoryName.match(separators);
    if (!isMatch) {
      return directoryName;
    }

    const firstSeparator = isMatch[0];
    const splitArr = directoryName.split(firstSeparator);
    if (!this.isNumber(splitArr[0])) {
      return directoryName;
    }

    splitArr.shift();

    return splitArr.join(firstSeparator);
  }

  private isNumber(str: string): boolean {
    return /^\d+$/.test(str);
  }
}
