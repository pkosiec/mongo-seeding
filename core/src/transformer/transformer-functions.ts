import { ObjectId } from 'mongodb';
import { SeederCollection } from '../common';

/**
 * Defines transformer function, which manipulates collections before using them to database seeding.
 */
export type CollectionTransformerFn = (c: SeederCollection) => SeederCollection;

/**
 * Rewrites `id` property to `_id` for every document in given collection.
 *
 * @param collection Collection details
 */
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

/**
 * Set createdAt timestamp for every document in given collection.
 *
 * @param collection Collection details
 */
const setCreatedAtTimestamp = (collection: SeederCollection): SeederCollection => {
  const documents = collection.documents.map(
    (document: { createdAt?: Date }) => {
      const documentToInsert = {
        ...document,
        createdAt: new Date()
      };

      return documentToInsert;
    },
  );

  return {
    ...collection,
    documents,
  };
};

/**
 * Set updatedAt timestamp for every document in given collection.
 *
 * @param collection Collection details
 */
const setUpdatedAtTimestamp = (collection: SeederCollection): SeederCollection => {
  const documents = collection.documents.map(
    (document: { updatedAt?: Date }) => {
      const documentToInsert = {
        ...document,
        updatedAt: new Date()
      };

      return documentToInsert;
    },
  );

  return {
    ...collection,
    documents,
  };
};

/**
 * Contains default transformer functions.
 */
export const DefaultTransformers = {
  replaceDocumentIdWithUnderscoreId,
  setCreatedAtTimestamp,
  setUpdatedAtTimestamp
};
