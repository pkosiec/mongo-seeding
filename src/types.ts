import { ObjectId } from 'mongodb';

export interface CollectionToImport {
  name: string;
  documents: any[];
}
