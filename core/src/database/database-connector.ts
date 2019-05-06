import { MongoClient } from 'mongodb';
import { log } from '../common';
import {
  Database,
  sleep,
  checkTimeoutExpired,
  SeederDatabaseConfig,
  isSeederDatabaseConfigObject,
  SeederDatabaseConfigObject,
} from '.';

export class DatabaseConnector {
  static DEFAULT_DB_NAME = 'admin';
  static DEFAULT_RECONNECT_TIMEOUT_MILLIS = 10000;
  static SLEEP_INTERVAL_MILLIS = 500;

  client?: MongoClient;
  reconnectTimeoutMillis: number;

  constructor(reconnectTimeoutMillis?: number) {
    this.reconnectTimeoutMillis =
      reconnectTimeoutMillis != null
        ? reconnectTimeoutMillis
        : DatabaseConnector.DEFAULT_RECONNECT_TIMEOUT_MILLIS;
  }

  async connect(config: SeederDatabaseConfig): Promise<Database> {
    let uri, databaseName;
    if (typeof config === 'string') {
      uri = config;
      databaseName = this.getDbName(uri);
    } else if (isSeederDatabaseConfigObject(config)) {
      uri = this.getDbConnectionUri(config);
      databaseName = config.name;
    } else {
      throw new Error(
        'You have to pass connection URI or database config object',
      );
    }

    return this.connectWithUri(uri, databaseName);
  }

  async connectWithUri(
    dbConnectionUri: string,
    dbName: string,
  ): Promise<Database> {
    log(`Connecting to ${dbConnectionUri}...`);
    const startMillis = new Date().getTime();
    let client: MongoClient | undefined;
    do {
      try {
        client = await MongoClient.connect(
          dbConnectionUri,
          {
            ignoreUndefined: true,
            useNewUrlParser: true,
          },
        );
      } catch (err) {
        if (checkTimeoutExpired(startMillis, this.reconnectTimeoutMillis)) {
          throw new Error(
            `Timeout ${
              this.reconnectTimeoutMillis
            }s expired while connecting to database due to: ${err.name}: ${
              err.message
            }`,
          );
        }

        log(`${err.message}\nRetrying...`);
        await sleep(DatabaseConnector.SLEEP_INTERVAL_MILLIS);
      }
    } while (!client);

    log('Connection with database established.');
    this.client = client;

    const db = client.db(dbName);
    return new Database(db);
  }

  async close() {
    log('Closing connection...');
    if (!this.client || !this.client.isConnected()) {
      return;
    }

    await this.client.close(true);
  }

  getDbConnectionUri({
    protocol,
    host,
    port,
    name,
    username,
    password,
  }: SeederDatabaseConfigObject) {
    let credentials = '';
    if (username) {
      credentials = `${username}${password ? `:${password}` : ''}@`;
    }

    if (protocol === 'mongodb+srv') {
        return `${protocol}://${credentials}${host}/${name}`;    
    }
    return `${protocol}://${credentials}${host}:${port}/${name}`;
  }

  getDbName(dbConnectionUri: string) {
    const url = dbConnectionUri.replace('mongodb://', '');
    const parts = url.split('/');
    if (parts.length === 1) {
      // Database not given, return the default one
      return DatabaseConnector.DEFAULT_DB_NAME;
    }

    const lastPart = parts[parts.length - 1];
    const givenDbName = lastPart.split('?')[0];
    return givenDbName ? givenDbName : DatabaseConnector.DEFAULT_DB_NAME;
  }
}
