import { CollectionToImport } from '../common';
import { CollectionTransformerFn } from './Transformers';

export class CollectionTransformer {
  transform(
    collections: CollectionToImport[],
    transformers: Array<CollectionTransformerFn>,
  ) {
    let arr = collections;

    transformers.forEach(transformFn => {
      arr = arr.map(collection => transformFn(collection));
    });

    return arr;
  }
}
