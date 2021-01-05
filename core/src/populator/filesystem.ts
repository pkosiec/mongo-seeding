import { readdirSync, lstatSync, readFileSync } from 'fs';
import { EJSON } from 'bson';
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
    const directories = filesAndDirectories.filter((fileOrDirectory) => {
      const itemPath = `${path}/${fileOrDirectory}`;
      return (
        this.isDirectory(itemPath) &&
        !this.isEmpty(itemPath) &&
        !this.isHidden(fileOrDirectory)
      );
    });
    return directories;
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
    const documentFileNames = fileNames.filter((fileName) => {
      const fileNameSplit = fileName.split(
        FileSystem.FILE_NAME_SPLIT_CHARACTER,
      );
      if (this.shouldIgnoreFile(fileNameSplit)) {
        return false;
      }

      const fileExtension = fileNameSplit.pop()!;
      return supportedExtensions.some(
        (extension) => extension.toLowerCase() === fileExtension.toLowerCase(),
      );
    });

    return documentFileNames;
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
   */
  readFilesContent(paths: string[], ejsonParseOptions: EJSON.Options) {
    return paths.reduce<any[]>((arr: any[], path) => {
      const fileContent: any = this.readFile(path, ejsonParseOptions);
      return arr.concat(fileContent);
    }, []);
  }

  /**
   * Reads a file from path. If it is a JSON, uses EJSON parser.
   *
   * @param path File path
   */
  readFile(path: string, ejsonParseOptions: EJSON.Options): any {
    const fileExtension = extname(path);

    if (fileExtension !== '.json') {
      return importFresh(path);
    }

    const content = readFileSync(path, 'utf-8');
    return EJSON.parse(content, ejsonParseOptions);
  }
}

/**
 * Default `FileSystem` instance
 */
export const fileSystem = new FileSystem();
