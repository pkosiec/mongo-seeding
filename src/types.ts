import { ObjectId } from 'mongodb';

export interface CollectionToImport {
  name: string;
  documents: Array<{ id?: string | ObjectId }>;
}
