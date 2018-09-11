import { MongoClient, Db } from 'mongodb';
import { DatabaseConfig, log } from '../common';
import { Database, sleep, checkTimeoutExpired } from '.';

export interface DatabaseConnectorConfig {
  databaseConnectionUri?: string;
  databaseConfig?: DatabaseConfig;
}

export class DatabaseConnector {
  static SLEEP_INTERVAL_MILLIS = 500;
  static DEFAULT_DB_NAME = 'admin';
  static DEFAULT_RECONNECT_TIME_IN_SECONDS = 10;

  client?: MongoClient;
  reconnectTimeoutInSeconds: number;

  constructor(reconnectTimeoutInSeconds?: number) {
    this.reconnectTimeoutInSeconds =
      reconnectTimeoutInSeconds != null
        ? reconnectTimeoutInSeconds
        : DatabaseConnector.DEFAULT_RECONNECT_TIME_IN_SECONDS;
  }

  async connect({
    databaseConnectionUri,
    databaseConfig,
  }: DatabaseConnectorConfig): Promise<Database> {
    let uri, databaseName;
    if (databaseConnectionUri) {
      uri = databaseConnectionUri;
      databaseName = this.getDbName(databaseConnectionUri);
    } else if (databaseConfig) {
      uri = this.getDbConnectionUri(databaseConfig);
      databaseName = databaseConfig.name;
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
    const reconnectTimeoutMillis = this.reconnectTimeoutInSeconds * 1000;
    let client: MongoClient | undefined;
    do {
      try {
        client = await MongoClient.connect(dbConnectionUri, {
          ignoreUndefined: true,
          useNewUrlParser: true,
        });
      } catch (err) {
        if (checkTimeoutExpired(startMillis, reconnectTimeoutMillis)) {
          throw new Error(
            `Timeout ${
              this.reconnectTimeoutInSeconds
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
  }: DatabaseConfig) {
    let credentials = '';
    if (username) {
      credentials = `${username}${password ? `:${password}` : ''}@`;
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
