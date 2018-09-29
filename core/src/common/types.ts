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
  database: string | DatabaseConfig;
  databaseReconnectTimeout: number;
  inputPath: string;
  dropDatabase: boolean;
  dropCollection: boolean;
}

export interface Collection {
  name: string;
  documents: Object[];
}
