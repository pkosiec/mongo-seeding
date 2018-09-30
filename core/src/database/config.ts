export type SeederDatabaseConfig = string | SeederDatabaseConfigObject;

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

export const defaultDatabaseConfigObject: SeederDatabaseConfigObject = {
  protocol: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  name: 'database',
  username: undefined,
  password: undefined,
};
