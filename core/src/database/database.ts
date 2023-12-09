import { Db, MongoClient, BulkWriteOptions } from 'mongodb';
import { DeepPartial, LogFn } from '../common';
import { SeederDatabaseConfigObject } from '../config';
import { ConnectionString, IConnectionDefaults } from 'connection-string';

/**
 * Provides functionality for managing documents, collections in database.
 */
export class Database {
  /**
   * MongoDB database object
   */
  db: Db;

  /**
   * MongoDB Client.
   */
  client?: MongoClient;

  /**
   * Logger instance
   */
  log: LogFn;

  /**
   * Constructs a new `Database` object.
   *
   * @param mongoClient MongoDB Client
   * @param log Optional logger
   */
  constructor(mongoClient: MongoClient, log?: LogFn) {
    this.client = mongoClient;
    this.db = mongoClient.db();
    this.log = log
      ? log
      : () => {
          // do nothing
        };
  }

  /**
   * Inserts documents into a given collection.
   *
   * @param documentsToInsert Array of documents, which are being imported
   * @param collectionName Collection name
   * @param bulkWriteOptions Optional collection import options
   */
  async insertDocumentsIntoCollection(
    documentsToInsert: object[],
    collectionName: string,
    bulkWriteOptions?: BulkWriteOptions,
  ) {
    const documentsCopy = documentsToInsert.map((document) => ({
      ...document,
    }));
    return this.db
      .collection(collectionName)
      .insertMany(documentsCopy, bulkWriteOptions);
  }

  /**
   * Drops database.
   */
  async drop() {
    return this.db.dropDatabase();
  }

  /**
   * Checks if a given collection exist.
   *
   * @param collectionName Collection name
   */
  async ifCollectionExist(collectionName: string): Promise<boolean> {
    const collections = await this.db.collections();
    return collections
      .map((collection) => collection.collectionName)
      .includes(collectionName);
  }

  /**
   * Drops a given collection if exists.
   *
   * @param collectionName Collection name
   */
  async dropCollectionIfExists(collectionName: string) {
    if (!(await this.ifCollectionExist(collectionName))) {
      return;
    }

    return this.db.collection(collectionName).drop();
  }

  /**
   * Remove all documents from a given collection
   * if it exists.
   *
   * @param collectionName Collection name
   */
  async removeAllDocumentsIfCollectionExists(collectionName: string) {
    if (!(await this.ifCollectionExist(collectionName))) {
      return;
    }

    return this.db.collection(collectionName).deleteMany({});
  }

  /**
   * Closes connection with database.
   */
  async closeConnection() {
    this.log('Closing connection...');
    if (!this.client) {
      return;
    }

    await this.client.close(true);
  }
}

/**
 * Parses a database config object or a connection URI into a ConnectionString.
 * @param input The database config object or connection URI to parse.
 * @param mergeWithDefaults Whether to merge the parsed config with default values.
 */
export function parseSeederDatabaseConfig(
  input?: string | DeepPartial<SeederDatabaseConfigObject>,
  disableMergingWithDefaults?: boolean,
): ConnectionString {
  const defaultParams = defaultConnParams();
  let uri: string | null = null;
  if (!input) {
    return new ConnectionString(null, defaultParams);
  }

  switch (typeof input) {
    case 'object':
      // parse the object into a URI first, and then parse the URI into a ConnectionString
      uri = parseUriFromObject(input).toString();
      break;
    case 'string':
      uri = input;
      break;
    default:
      throw new Error(
        'Connection URI or database config object is required to connect to database',
      );
  }

  if (disableMergingWithDefaults) {
    return new ConnectionString(uri);
  }

  const out = new ConnectionString(uri, defaultParams);
  if (out.hosts && out.hosts.length > 1) {
    out.hosts = [out.hosts[0]];
  }
  return out;
}

/**
 * Parses a database config object into a URI.
 * @param config The database config object to parse.
 */
function parseUriFromObject(
  config: Partial<SeederDatabaseConfigObject>,
): ConnectionString {
  return new ConnectionString(null, {
    protocol: config.protocol,
    hosts: [
      {
        name: config.host,
        port: config.port,
      },
    ],
    user: config.username,
    password: config.password,
    path: config.name ? [config.name] : undefined,
    params: config.options,
  });
}

/**
 * Returns default connection parameters.
 */
function defaultConnParams(): IConnectionDefaults {
  return {
    protocol: 'mongodb',
    hosts: [
      {
        name: '127.0.0.1',
        port: 27017,
      },
    ],
    path: ['database'],
    user: undefined,
    password: undefined,
    params: undefined,
  };
}
