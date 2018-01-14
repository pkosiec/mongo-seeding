import { fileSystem } from '../../src/FileSystem';

// Import mocks
jest.mock('fs', () => ({
  lstatSync: jest.fn().mockReturnValue({
    isDirectory: jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false),
  }),
  readdirSync: jest.fn().mockReturnValue(['test1.txt', 'testDirectory', '.test2']),
}));

describe('Reading files', () => {
  it('should return all files list from directory', () => {
    const fileNames = fileSystem.listFileNames('/any/path');
    expect(fileNames).toEqual(['test1.txt', 'testDirectory', '.test2']);
  });

  it('should return not empty directories from list of files and directories', () => {
    const dirs = fileSystem.listNotEmptyDirectories('/any/path');
    expect(dirs).toEqual(["testDirectory"]);
  });

  it('should filter supported documents from all files in directory', () => {
    const fileNames = [
      '.README.md',
      'dist',
      'file1.json',
      'file2.js',
      'release.sh',
      'data-import.js',
    ];
    const supportedExtensions = ['js', 'json'];
    const supportedDocuments = fileSystem.getSupportedDocumentFileNames(
      fileNames,
      supportedExtensions,
    );
    expect(supportedDocuments).toEqual([
      'file1.json',
      'file2.js',
      'data-import.js',
    ]);
  });

  it('should recognize hidden or files with no extension', () => {
    const ignoreFile = fileSystem.shouldIgnoreFile('test.extension'.split('.'));
    expect(ignoreFile).toBeFalsy();

    const ignoreHiddenFile = fileSystem.shouldIgnoreFile('.test.js'.split('.'));
    expect(ignoreHiddenFile).toBeTruthy();

    const ignoreFileWithNoExtension = fileSystem.shouldIgnoreFile(
      'test'.split('.'),
    );
    expect(ignoreFileWithNoExtension).toBeTruthy();

    const ignoreHiddenFileWithNoExtension = fileSystem.shouldIgnoreFile(
      '.test'.split('.'),
    );
    expect(ignoreHiddenFileWithNoExtension).toBeTruthy();
  });

  jest.mock('mockFiles/test1.json', () => ({ number: 1 }), { virtual: true });
  jest.mock(
    'mockFiles/test2.js',
    () => ({
      value: {
        second: true,
      },
    }),
    { virtual: true },
  );
  jest.mock('mockFiles/test3.json', () => ({ string: 'three' }), {
    virtual: true,
  });

  it('should get documents content array from array of file names', () => {
    const documentFileNames = ['test1.json', 'test2.js', 'test3.json'];
    const contentArray = fileSystem.getFilesContentArray(
      'mockFiles',
      documentFileNames,
    );

    expect(contentArray).toEqual([
      {
        number: 1,
      },
      {
        value: {
          second: true,
        },
      },
      {
        string: 'three',
      },
    ]);
  });
});
