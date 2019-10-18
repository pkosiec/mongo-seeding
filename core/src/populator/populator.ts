import { SeederCollection, log } from '../common';
import { fileSystem } from './filesystem';
import { Collection } from 'mongodb';

/**
 * Populates collections from disk.
 */
export class CollectionPopulator {
  /**
   * Supported file extensions
   */
  extensions: string[];

  /**
   * Constructs new `CollectionPopulator` object.
   *
   * @param extensions Array of file extensions
   */
  constructor(extensions: string[]) {
    if (extensions.length === 0) {
      throw new Error('Array of supported extensions must not be empty');
    }
    this.extensions = extensions;
  }

  /**
   * Reads collections from path.
   *
   * @param path
   */
  readFromPath(path: string): SeederCollection[] {
    const subdirectories = fileSystem.listValidDirectories(path);
    return this.readCollections(subdirectories, path);
  }

  /**
   * Read all collections from base path
   *
   * @param directories Array of directories names
   * @param inputDirectory Base directory
   */
  private readCollections(directories: string[], inputDirectory: string) {
    const collections = directories.reduce(
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

    return this.sortCollections(collections);
  }

  private sortCollections(collections: SeederCollection[]): SeederCollection[] {
    return collections.sort((a, b) => {
      if (!a.orderNo || !b.orderNo) {
        return 0;
      }

      if (a.orderNo > b.orderNo) {
        return 1;
      }
      return -1;
    });
  }

  /**
   * Reads collection along with documents content from a given path.
   *
   * @param path Collection Path
   * @param directoryName Directory name
   */
  private readCollection(
    path: string,
    directoryName: string,
  ): SeederCollection | null {
    const { name, orderNo } = this.getCollectionMetadata(directoryName);
    const documents = this.populateDocumentsContent(path);
    if (!documents) {
      return null;
    }

    return {
      orderNo,
      name,
      documents,
    };
  }

  /**
   * Populates MongoDB documents content by reading files.
   *
   * @param collectionPath Path for a single collection
   */
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

  /**
   * Reads collection name from directory name.
   *
   * @param directoryName Directory name
   */
  private getCollectionMetadata(
    directoryName: string,
  ): { name: string; orderNo?: number } {
    const separators = /\s*[-_\.\s]\s*/;

    const isMatch = directoryName.match(separators);
    if (!isMatch) {
      return { name: directoryName };
    }

    const firstSeparator = isMatch[0];
    const splitArr = directoryName.split(firstSeparator);
    if (!this.isNumber(splitArr[0])) {
      return { name: directoryName };
    }

    const orderNo = Number(splitArr.shift());
    return {
      name: splitArr.join(firstSeparator),
      orderNo: orderNo,
    };
  }

  /**
   * Checks if a string is number.
   *
   * @param str String which can contain number
   */
  private isNumber(str: string): boolean {
    return /^\d+$/.test(str);
  }
}
