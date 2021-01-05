import { existsSync, mkdirSync } from 'fs';

import { CollectionPopulator } from '../../src/populator';
import { defaultCollectionReadingOptions } from '../../src';

const IMPORT_DATA_DIR = __dirname + '/_importdata';

interface ExpectedDocuments {
  [key: string]: object[];
}

describe('CollectionPopulator', () => {
  it('should populate documents correctly', () => {
    const expectedDocuments: ExpectedDocuments = {
      array: [
        {
          number: 1,
          name: 'one',
        },
        {
          number: 2,
          name: 'two',
        },
        {
          number: 3,
          name: 'three',
        },
        {
          number: 4,
          name: 'four',
        },
        {
          number: 5,
          name: 'five',
        }
      ],
      object: [
        {
          number: 6,
          name: 'six',
        },
        {
          number: 7,
          name: 'seven',
        },
        {
          number: 8,
          name: 'eight',
        },
      ],
    };

    for (const key of Object.keys(expectedDocuments)) {
      const collectionPopulator = new CollectionPopulator(
        defaultCollectionReadingOptions.extensions,
        defaultCollectionReadingOptions.ejsonParseOptions!,
      );
      const path = `${IMPORT_DATA_DIR}/populator-docs/${key}`;

      // @ts-ignore
      const documents = collectionPopulator.populateDocumentsContent(path);

      expectedDocuments[key].forEach(expectedDocument => {
        expect(documents).toContainEqual(
          expect.objectContaining(expectedDocument),
        );
      });
    }
  });

  it('should fail when directory is not found', () => {
    const path = '/surely/not/existing/path';
    const collectionPopulator = new CollectionPopulator(
      defaultCollectionReadingOptions.extensions,
      defaultCollectionReadingOptions.ejsonParseOptions!,
    );

    expect(() => {
      collectionPopulator.readFromPath(path);
    }).toThrowError('ENOENT');
  });

  it('should skip empty directories', () => {
    const collectionPopulator = new CollectionPopulator(
      defaultCollectionReadingOptions.extensions,
      defaultCollectionReadingOptions.ejsonParseOptions!,
    );
    const path = `${IMPORT_DATA_DIR}/populator-skip-empty`;

    const dirsToCreate = ['empty-dir-1', 'empty-dir-2'];
    dirsToCreate.forEach(dir => {
      const dirPath = `${path}/${dir}`;
      if (existsSync(dirPath)) {
        return;
      }

      mkdirSync(dirPath);
    });

    const collections = collectionPopulator.readFromPath(path);
    expect(collections).toHaveLength(0);
  });
});
