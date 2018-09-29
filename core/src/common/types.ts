export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type SeederDatabaseConfig = string | SeederDatabaseConfigObject;

export interface SeederConfig {
  database: SeederDatabaseConfig; // database connection URI or configuration object
  databaseReconnectTimeout: number; // maximum time of waiting for successful MongoDB connection in milliseconds
  dropDatabase: boolean; // drops entire database before import
  dropCollection: boolean; // drops collection before importing it
}

export interface SeederDatabaseConfigObject {
  protocol: string;
  host: string;
  port: number;
  name: string;
  username?: string;
  password?: string;
}

export function isSeederDatabaseConfigObject(
  object: any,
): object is SeederDatabaseConfigObject {
  return (
    typeof object.protocol === 'string' &&
    typeof object.host === 'string' &&
    typeof object.port === 'number' &&
    typeof object.name === 'string'
  );
}

export interface SeederCollection {
  name: string;
  documents: Object[];
}
