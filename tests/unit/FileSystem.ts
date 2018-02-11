import { fileSystem } from '../../src/data-processing';

jest.mock('fs', () => ({
  lstatSync: jest.fn().mockReturnValue({
    isDirectory: jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false),
  }),
  readdirSync: jest
    .fn()
    .mockReturnValue([
      'test1.txt',
      'testDirectory',
      '.hiddenDirectory',
      '.test2',
    ]),
}));

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

describe('FileSystem module', () => {
  it('should list all directories that are not empty or hidden', () => {
    const dirs = fileSystem.listValidDirectories('/any/path');

    expect(dirs).toEqual(['testDirectory']);
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

    const supportedDocuments = fileSystem.filterSupportedDocumentFileNames(
      fileNames,
      supportedExtensions,
    );

    expect(supportedDocuments).toEqual([
      'file1.json',
      'file2.js',
      'data-import.js',
    ]);
  });

  it('should ignore hidden files and files with no extension', () => {
    const ignoreFile = fileSystem.shouldIgnoreFile('test.extension'.split('.'));
    const ignoreHiddenFile = fileSystem.shouldIgnoreFile('.test.js'.split('.'));
    const ignoreFileWithNoExtension = fileSystem.shouldIgnoreFile(
      'test'.split('.'),
    );
    const ignoreHiddenFileWithNoExtension = fileSystem.shouldIgnoreFile(
      '.test'.split('.'),
    );

    expect(ignoreFile).toBeFalsy();
    expect(ignoreHiddenFile).toBeTruthy();
    expect(ignoreFileWithNoExtension).toBeTruthy();
    expect(ignoreHiddenFileWithNoExtension).toBeTruthy();
  });

  it('should get documents content array from array of file names', () => {
    const documentFilePaths = [
      'mockFiles/test1.json',
      'mockFiles/test2.js',
      'mockFiles/test3.json',
    ];
    const expectedContentArray = [
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
    ];

    const actualContentArray = fileSystem.readFilesContent(documentFilePaths);

    expect(actualContentArray).toEqual(expectedContentArray);
  });
});
