import { readdirSync, lstatSync } from 'fs';

export class FileSystem {
  static FILE_NAME_SPLIT_CHARACTER = '.';

  listFileNames(path: string) {
    return readdirSync(path) || [];
  }

  listNotEmptyDirectories(inputDirectory: string) {
    const filesAndDirectories = this.listFileNames(inputDirectory);
    const directories = filesAndDirectories.filter(fileOrDirectory => {
      const path = `${inputDirectory}/${fileOrDirectory}`;
      return this.isDirectory(path) && this.isNotEmpty(path);
    });
    return directories;
  }

  isNotEmpty(path: string) {
    return this.listFileNames(path).length > 0;
  }

  isDirectory(path: string) {
    const stats = lstatSync(path);
    return stats.isDirectory();
  }

  getSupportedDocumentFileNames(
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

  getFilesContentArray(directory: string, fileNames: string[]) {
    const documentsContentArray = fileNames.reduce<any[]>(
      (arr: any[], fileName) => {
        const filePath = `${directory}/${fileName}`;
        const fileContent: any = require(filePath);
        return arr.concat(fileContent);
      },
      [],
    );

    return documentsContentArray;
  }
}

export const fileSystem = new FileSystem();
