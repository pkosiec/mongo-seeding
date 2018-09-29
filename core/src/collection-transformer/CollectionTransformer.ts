import { Collection } from '../common';
import { CollectionTransformerFn } from './Transformers';

export class CollectionTransformer {
  transform(
    collections: Collection[],
    transformers: Array<CollectionTransformerFn>,
  ) {
    let arr = collections;

    transformers.forEach(transformFn => {
      arr = arr.map(collection => transformFn(collection));
    });

    return arr;
  }
}
