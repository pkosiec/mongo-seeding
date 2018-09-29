import { ObjectId } from 'mongodb';
import { Collection } from '../common/types';

export type CollectionTransformerFn = (c: Collection) => Collection;

// Rewrites `id` property to `_id` for every document
export const replaceDocumentIdWithUnderscoreId = (
  collection: Collection,
): Collection => {
  const documents = collection.documents.map(
    (document: { id?: string | ObjectId }) => {
      if (typeof document.id === 'undefined') {
        return document;
      }

      const documentToInsert = {
        ...document,
        _id: document.id,
      };

      delete documentToInsert.id;
      return documentToInsert;
    },
  );

  return {
    ...collection,
    documents,
  };
};
