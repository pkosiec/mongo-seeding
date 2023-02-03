import { MongoClient, MongoClientOptions } from 'mongodb';
import { URLSearchParams } from 'url';
import {
  Database,
  SeederDatabaseConfig,
  isSeederDatabaseConfigObject,
  SeederDatabaseConfigObject,
} from '.';
import { LogFn } from '../common';

/**
 * Provides functionality to manage connection to a MongoDB database.
 */
export class DatabaseConnector {
  /**
   * Masked URI credentials token.
   */
  static MASKED_URI_CREDENTIALS = '[secure]';

  static DEFAULT_CLIENT_OPTIONS: MongoClientOptions = {
    ignoreUndefined: true,
    connectTimeoutMS: 10000,
  };

  /**
   * MongoDB Client options
   */
  clientOptions: MongoClientOptions;

  /**
   * Logger instance
   */
  log: LogFn;

  /**
   * Constructs the `DatabaseConnector` object.
   *
   * @param reconnectTimeoutMillis Reconnect timeout in milliseconds. Ignored when custom MongoClientOptions are passed.
   * @param mongoClientOptions Optional Mongo Client options
   * @param log Optional logger
   */
  constructor(
    reconnectTimeoutMillis?: number,
    mongoClientOptions?: MongoClientOptions,
    log?: LogFn,
  ) {
    this.clientOptions =
      mongoClientOptions != null
        ? mongoClientOptions
        : {
            ...DatabaseConnector.DEFAULT_CLIENT_OPTIONS,
            connectTimeoutMS: reconnectTimeoutMillis,
          };
    this.log = log
      ? log
      : () => {
          // do nothing
        };
  }

  /**
   * Connects to database.
   *
   * @param config Database configuration
   */
  async connect(config: SeederDatabaseConfig): Promise<Database> {
    const dbConnectionUri = this.getUri(config);
    const mongoClient = new MongoClient(dbConnectionUri, this.clientOptions);

    this.log(`Connecting to ${this.maskUriCredentials(dbConnectionUri)}...`);

    try {
      await mongoClient.connect();
    } catch (err) {
      const e = err as Error;
      throw new Error(`Error connecting to database: ${e.name}: ${e.message}`);
    }

    this.log('Connection with database established.');

    return new Database(mongoClient);
  }

  /**
   * Gets MongoDB Connection URI from config.
   *
   * @param config Database configuration
   */
  private getUri(config: SeederDatabaseConfig): string {
    if (typeof config === 'string') {
      return config;
    }

    if (isSeederDatabaseConfigObject(config as unknown)) {
      return this.getDbConnectionUri(config);
    }

    throw new Error(
      'Connection URI or database config object is required to connect to database',
    );
  }

  /**
   * Constructs database connection URI from database configuration object.
   *
   * @param param0 Database connection object
   */
  private getDbConnectionUri({
    protocol,
    host,
    port,
    name,
    username,
    password,
    options,
  }: SeederDatabaseConfigObject) {
    const credentials = username
      ? `${username}${password ? `:${password}` : ''}@`
      : '';
    const optsUriPart = options
      ? `?${new URLSearchParams(options).toString()}`
      : '';
    const portUriPart = protocol !== 'mongodb+srv' ? `:${port}` : '';

    return `${protocol}://${credentials}${host}${portUriPart}/${name}${optsUriPart}`;
  }

  /**
   * Detects database connection credentials and masks them, replacing with masked URI credentials token.
   *
   * @param uri Database connection URI
   */
  private maskUriCredentials(uri: string): string {
    if (!uri.includes('@')) {
      return uri;
    }

    const creds = uri.substring(uri.indexOf('://') + 3, uri.indexOf('@'));
    return uri.replace(creds, DatabaseConnector.MASKED_URI_CREDENTIALS);
  }
}
