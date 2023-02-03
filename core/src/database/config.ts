/**
 * Represents database connection configuration. It can be a URI string or object.
 */
export type SeederDatabaseConfig = string | SeederDatabaseConfigObject;

/**
 * Defines configuration for Database connection in a form of an object.
 */
export interface SeederDatabaseConfigObject {
  /**
   * Database connection protocol
   */
  protocol: string;

  /**
   * Database connection host
   */
  host: string;

  /**
   * Database connection port
   */
  port: number;

  /**
   * Database name.
   */
  name: string;

  /**
   * Database Username.
   */
  username?: string;

  /**
   * Database password.
   */
  password?: string;

  /**
   * Options for MongoDB Database Connection URI.
   * Read more on: https://docs.mongodb.com/manual/reference/connection-string.
   */
  options?: SeederDatabaseConfigObjectOptions;
}

/**
 * Defines options for MongoDB Database Connection URI.
 * Read more on: https://docs.mongodb.com/manual/reference/connection-string.
 */
export interface SeederDatabaseConfigObjectOptions {
  [key: string]: string;
}

/**
 * Stores default values for database connection.
 */
export const defaultDatabaseConfigObject: SeederDatabaseConfigObject = {
  protocol: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  name: 'database',
  username: undefined,
  password: undefined,
  options: undefined,
};

/**
 * Checks if an object is valid database connection configuration.
 *
 * @param object Input object
 */
export function isSeederDatabaseConfigObject(object: unknown): boolean {
  if (typeof object !== 'object' && object === null) {
    return false;
  }

  const obj = object as { [key: string]: unknown };

  return (
    typeof obj.protocol === 'string' &&
    typeof obj.host === 'string' &&
    typeof obj.port === 'number' &&
    typeof obj.name === 'string'
  );
}
