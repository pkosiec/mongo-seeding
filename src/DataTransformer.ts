import { CollectionToImport } from './types';

export class DataTransformer {
  static replaceDocumentIdWithUnderscoreId(
    collection: CollectionToImport,
  ): CollectionToImport {
    const documents = collection.documents.map(document => {
      if (typeof document.id === 'undefined') {
        return document;
      }

      const documentToInsert = {
        ...document,
        _id: document.id,
      };

      delete documentToInsert.id;
      return documentToInsert;
    });

    return {
      ...collection,
      documents,
    };
  }

  transform(
    collections: CollectionToImport[],
    transformCollection: ((c: CollectionToImport) => CollectionToImport),
  ) {
    return collections.map(collection => transformCollection(collection));
  }
}
