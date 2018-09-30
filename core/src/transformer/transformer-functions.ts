import { ObjectId } from 'mongodb';
import { SeederCollection } from '../common';

export type CollectionTransformerFn = (c: SeederCollection) => SeederCollection;

// Rewrites `id` property to `_id` for every document
const replaceDocumentIdWithUnderscoreId = (
  collection: SeederCollection,
): SeederCollection => {
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

export const DefaultTransformers = {
  replaceDocumentIdWithUnderscoreId,
};
