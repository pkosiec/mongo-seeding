import { ObjectId } from 'mongodb';
import { CollectionToImport } from '../common/types';

export type CollectionTransformerFn = (
  c: CollectionToImport,
) => CollectionToImport;

export const replaceDocumentIdWithUnderscoreId = (
  collection: CollectionToImport,
): CollectionToImport => {
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
