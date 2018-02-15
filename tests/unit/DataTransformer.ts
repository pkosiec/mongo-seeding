import { DataTransformer } from '../../src/data-processing';
import { CollectionToImport } from '../../src/common';

describe('DataTransformer', () => {
  it('should transform collections with given functions', () => {
    const dataTransformer = new DataTransformer();
    const collections: CollectionToImport[] = [
      {
        name: '1',
        documents: [],
      },
      {
        name: '2',
        documents: [{ '1': 1 }, { '2': 2 }],
      },
      {
        name: '3',
        documents: [{ '3': 3 }],
      },
    ];
    const stubFunction = jest.fn();

    dataTransformer.transform(collections, stubFunction);
    expect(stubFunction).toHaveBeenCalledTimes(3);
    expect(stubFunction).toBeCalledWith(collections[1]);
  });

  it('should replace document `id` property with `_id`', () => {
    const dataTransformer = new DataTransformer();
    const collections: CollectionToImport[] = [
      {
        name: 'Test',
        documents: [
          { id: 'id_1', name: 'Test 1', value: 1 },
          { id: '2_id', name: 'Test 2', value: 2 },
          { name: 'Test 3', value: 3 },
        ],
      },
    ];
    const expectedData = [
      {
        name: 'Test',
        documents: [
          { _id: 'id_1', name: 'Test 1', value: 1 },
          { _id: '2_id', name: 'Test 2', value: 2 },
          { name: 'Test 3', value: 3 },
        ],
      },
    ];

    const actualData = dataTransformer.transform(
      collections,
      DataTransformer.replaceDocumentIdWithUnderscoreId,
    );

    expect(actualData).toEqual(expectedData);
  });
});
