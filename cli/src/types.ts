export interface CommandLineOption {
  name: string;
  alias?: string;
  defaultOption?: boolean;
  description: string;
  type: StringConstructor | NumberConstructor | BooleanConstructor;
}

export interface CommandLineArguments {
  data?: string;
  [key: string]: string | number | boolean | undefined;
  'drop-database'?: boolean;
  'drop-collections'?: boolean;
  'replace-id'?: boolean;
  'db-protocol'?: string;
  'db-host'?: string;
  'db-port'?: number;
  'db-name'?: string;
  'db-username'?: string;
  'db-password'?: string;
  'db-uri'?: string;
  'reconnect-timeout'?: number;
}
