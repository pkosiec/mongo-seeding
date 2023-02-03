import { SeederCollection } from '../common';
import { CollectionTransformerFn } from '.';

/**
 * Transforms collections using transformer functions.
 */
export class CollectionTransformer {
  /**
   * Transforms given collections using transformer functions.
   *
   * @param collections Array of collections
   * @param transformers Array of transformer functions
   */
  transform(
    collections: SeederCollection[],
    transformers: Array<CollectionTransformerFn>,
  ) {
    let arr = collections;

    transformers.forEach((transformFn) => {
      arr = arr.map((collection) => transformFn(collection));
    });

    return arr;
  }
}
