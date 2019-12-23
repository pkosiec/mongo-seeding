import {
  CollectionTransformer,
  DefaultTransformers,
} from '../../src/transformer';
import { SeederCollection } from '../../src/common';

describe('CollectionTransformer', () => {
  it('should transform collections with given functions', () => {
    const collectionTransformer = new CollectionTransformer();
    const collections: SeederCollection[] = [
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

    collectionTransformer.transform(collections, [stubFunction]);
    expect(stubFunction).toHaveBeenCalledTimes(3);
    expect(stubFunction).toBeCalledWith(collections[1]);
  });

  it('should replace document `id` property with `_id`', () => {
    const collectionTransformer = new CollectionTransformer();
    const collections: SeederCollection[] = [
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

    const actualData = collectionTransformer.transform(collections, [
      DefaultTransformers.replaceDocumentIdWithUnderscoreId,
    ]);

    expect(actualData).toEqual(expectedData);
  });
});
