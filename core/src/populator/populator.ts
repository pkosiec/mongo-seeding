import { EJSON } from 'bson';
import { SeederCollection, SeederCollectionMetadata, LogFn } from '../common';
import { fileSystem } from './filesystem';

/**
 * Populates collections from disk.
 */
export class CollectionPopulator {
  /**
   * Supported file extensions
   */
  extensions: string[];

  ejsonParseOptions: EJSON.Options;

  /**
   * Logger instance
   */
  log: LogFn;

  /**
   * Constructs new `CollectionPopulator` object.
   *
   * @param extensions Array of file extensions
   */
  constructor(
    extensions: string[],
    ejsonParseOptions: EJSON.Options,
    log?: LogFn,
  ) {
    if (extensions.length === 0) {
      throw new Error('Array of supported extensions must not be empty');
    }
    this.extensions = extensions;
    this.ejsonParseOptions = ejsonParseOptions;
    this.log = log ? log : () => {};
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
      const aOrderNo =
        typeof a.orderNo !== 'undefined' ? a.orderNo : Number.MAX_SAFE_INTEGER;
      const bOrderNo =
        typeof b.orderNo !== 'undefined' ? b.orderNo : Number.MAX_SAFE_INTEGER;

      if (aOrderNo > bOrderNo) {
        return 1;
      }
      if (aOrderNo < bOrderNo) {
        return -1;
      }

      return 0;
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
      this.log(`Directory '${collectionPath}' is empty. Skipping...`);
      return;
    }

    const documentFileNames = fileSystem.filterSupportedDocumentFileNames(
      fileNames,
      this.extensions,
    );
    if (documentFileNames.length === 0) {
      this.log(
        `No supported files found in directory '${collectionPath}'. Skipping...`,
      );
      return;
    }

    const documentPaths = documentFileNames.map(
      (fileName) => `${collectionPath}/${fileName}`,
    );
    return fileSystem.readFilesContent(documentPaths, this.ejsonParseOptions);
  }

  /**
   * Reads collection name from directory name.
   *
   * @param directoryName Directory name
   */
  private getCollectionMetadata(
    directoryName: string,
  ): SeederCollectionMetadata {
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
