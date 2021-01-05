import { fileSystem } from '../../src/populator/filesystem';
import { ObjectId, MaxKey, MinKey } from 'bson';

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
  readFileSync: jest.fn((filePath: string) => {
    let content;
    switch (filePath) {
      case 'mockFiles/test1.json':
        content = { number: 1 };
        break;
      case 'mockFiles/test3.json':
        content = { string: 'three' };
        break;
      case 'mockFiles/ejson.json':
        content = {
          _id: {
            $oid: '57e193d7a9cc81b4027498b5',
          },
          date: { $date: '2012-09-27' },
          minKey: { $minKey: 1 },
          maxKey: { $maxKey: 1 },
        };
        break;
      default:
        content = {};
    }

    return JSON.stringify(content);
  }),
}));

jest.mock('import-fresh', () =>
  jest.fn().mockReturnValue({
    value: {
      second: true,
    },
  }),
);

describe('FileSystem', () => {
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

    const actualContentArray = fileSystem.readFilesContent(documentFilePaths, {});

    expect(actualContentArray).toEqual(expectedContentArray);
  });

  it('should parse EJSON files', () => {
    const filePath = 'mockFiles/ejson.json';
    const result = fileSystem.readFile(filePath, {});

    expect(result).toEqual({
      _id: new ObjectId('57e193d7a9cc81b4027498b5'),
      date: new Date('2012-09-27'),
      minKey: new MinKey(),
      maxKey: new MaxKey(),
    });
  });
});
