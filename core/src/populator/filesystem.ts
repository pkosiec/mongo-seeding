import { lstatSync, readdirSync, readFileSync } from 'fs';
import { EJSON, EJSONOptions } from 'bson';
import { extname } from 'path';

const importFresh = require('import-fresh');

/**
 * Provides functionality for manipulating files and directories.
 */
export class FileSystem {
  static FILE_NAME_SPLIT_CHARACTER = '.';

  /**
   * Lists file names for a given path.
   *
   * @param path File path
   */
  listFileNames(path: string) {
    return readdirSync(path) || [];
  }

  /**
   * Lists directories which are not empty or hidden.
   *
   * @param path File path
   */
  listValidDirectories(path: string) {
    const filesAndDirectories = this.listFileNames(path);
    return filesAndDirectories.filter((fileOrDirectory) => {
      const itemPath = `${path}/${fileOrDirectory}`;
      return (
        this.isDirectory(itemPath) &&
        !this.isEmpty(itemPath) &&
        !this.isHidden(fileOrDirectory)
      );
    });
  }

  /**
   * Checks if a directory is empty.
   *
   * @param path File path
   */
  isEmpty(path: string) {
    return this.listFileNames(path).length === 0;
  }

  /**
   * Checks if a file or directory is empty.
   *
   * @param fileOrDirectoryName File or directory name
   */
  isHidden(fileOrDirectoryName: string) {
    return fileOrDirectoryName.startsWith('.');
  }

  /**
   * Checks if a path is a directory.
   *
   * @param path File path
   */
  isDirectory(path: string) {
    const stats = lstatSync(path);
    return stats.isDirectory();
  }

  /**
   * Filters files which are supported for database seeding.
   *
   * @param fileNames Array of file names
   * @param supportedExtensions Supported file extensions array
   */
  filterSupportedDocumentFileNames(
    fileNames: string[],
    supportedExtensions: string[],
  ) {
    return fileNames.filter((fileName) => {
      const fileNameSplit = fileName.split(
        FileSystem.FILE_NAME_SPLIT_CHARACTER,
      );
      if (this.shouldIgnoreFile(fileNameSplit)) {
        return false;
      }

      const fileExtension = fileNameSplit.pop();
      return supportedExtensions.some(
        (extension) => extension.toLowerCase() === fileExtension?.toLowerCase(),
      );
    });
  }

  /**
   * Checks if a file should be ignored based on extension.
   *
   * @param fileNameSplitByDot Array, which comes from file name split by dot
   */
  shouldIgnoreFile(fileNameSplitByDot: string[]) {
    const isHidden = !fileNameSplitByDot[0];
    const hasNoExtension = fileNameSplitByDot.length === 1;
    return isHidden || hasNoExtension;
  }

  /**
   * Reads content for multiple files.
   *
   * @param paths Array of paths
   * @param ejsonParseOptions EJSON parse options
   */
  async readFilesContent(paths: string[], ejsonParseOptions: EJSONOptions) {
    const fileContents: object[] = [];
    for (const path of paths) {
      const fileContent: unknown = await this.readFile(path, ejsonParseOptions);
      if (Array.isArray(fileContent)) {
        fileContents.push(...fileContent);
        continue;
      }
      fileContents.push(fileContent as object);
    }
    return fileContents;
  }

  /**
   * Reads a file from path. If it is a JSON, uses EJSON parser.
   *
   * @param path File path
   * @param ejsonParseOptions EJSON parse options
   */
  async readFile(
    path: string,
    ejsonParseOptions: EJSONOptions,
  ): Promise<unknown> {
    const fileExtension = extname(path);

    if (fileExtension === '.json') {
      const content = readFileSync(path, 'utf-8');
      return EJSON.parse(content, ejsonParseOptions);
    }

    if (fileExtension === '.mjs') {
      const content = await import(path);
      if (typeof content.default !== 'undefined') {
        return content.default;
      }

      return content as unknown;
    }

    return importFresh(path);
  }
}

/**
 * Default `FileSystem` instance
 */
export const fileSystem = new FileSystem();
