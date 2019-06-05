import { readdirSync, lstatSync, readFileSync } from 'fs';
import { EJSON } from 'bson';
import { extname } from 'path';

export class FileSystem {
  static FILE_NAME_SPLIT_CHARACTER = '.';

  listFileNames(path: string) {
    return readdirSync(path) || [];
  }

  listValidDirectories(inputDirectory: string) {
    const filesAndDirectories = this.listFileNames(inputDirectory);
    const directories = filesAndDirectories.filter(fileOrDirectory => {
      const path = `${inputDirectory}/${fileOrDirectory}`;
      return (
        this.isDirectory(path) &&
        !this.isEmpty(path) &&
        !this.isHidden(fileOrDirectory)
      );
    });
    return directories;
  }

  isEmpty(path: string) {
    return this.listFileNames(path).length === 0;
  }

  isHidden(fileOrDirectoryName: string) {
    return fileOrDirectoryName.startsWith('.');
  }

  isDirectory(path: string) {
    const stats = lstatSync(path);
    return stats.isDirectory();
  }

  filterSupportedDocumentFileNames(
    fileNames: string[],
    supportedExtensions: string[],
  ) {
    const documentFileNames = fileNames.filter(fileName => {
      const fileNameSplit = fileName.split(
        FileSystem.FILE_NAME_SPLIT_CHARACTER,
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

  readFilesContent(filePaths: string[]) {
    return filePaths.reduce<any[]>((arr: any[], filePath) => {
      const fileContent: any = this.readFile(filePath);
      return arr.concat(fileContent);
    }, []);
  }

  readFile(filePath: string): any {
    const fileExtension = extname(filePath);
    if (fileExtension === '.json') {
      const content = readFileSync(filePath, 'utf-8');
      return EJSON.parse(content, {
        relaxed: true,
      });
    }

    return require(filePath);
  }
}

export const fileSystem = new FileSystem();
