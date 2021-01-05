import { SeederConfig, SeederCollectionReadingOptions } from 'mongo-seeding';
import { DeepPartial } from 'mongo-seeding/dist/common';

export interface CommandLineOption {
  name: string;
  alias?: string;
  defaultOption?: boolean;
  description: string;
  type: StringConstructor | NumberConstructor | BooleanConstructor;
}

export interface CommandLineArguments {
  [key: string]: string | number | boolean | undefined;
  data?: string;
  silent?: boolean;
  'drop-database'?: boolean;
  'drop-collections'?: boolean;
  'replace-id'?: boolean;
  'set-timestamps'?: boolean;
  'db-protocol'?: string;
  'db-host'?: string;
  'db-port'?: number;
  'db-name'?: string;
  'db-username'?: string;
  'db-password'?: string;
  'db-options'?: string;
  'db-uri'?: string;
  'reconnect-timeout'?: number;
  'transpile-only'?: boolean;
  'ejson-parse-canonical-mode'?: boolean;
}

export type PartialCliOptions = DeepPartial<
  SeederConfig | SeederCollectionReadingOptions | CliSpecificOptions
>;
export interface CliSpecificOptions {
  transpileOnly: boolean;
  silent: boolean;
}
