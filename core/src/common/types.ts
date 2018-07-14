import { ObjectId } from 'mongodb';

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export interface DatabaseConfig {
  protocol: string;
  host: string;
  port: number;
  name: string;
  username?: string;
  password?: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  databaseConnectionUri?: string;
  inputPath: string;
  dropDatabase: boolean;
  dropCollection: boolean;
  replaceIdWithUnderscoreId: boolean;
  supportedExtensions: string[];
  reconnectTimeoutInSeconds: number;
}

export interface CollectionToImport {
  name: string;
  documents: any[];
}
