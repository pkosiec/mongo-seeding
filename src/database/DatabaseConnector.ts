import { MongoClient, Db } from 'mongodb';
import { DatabaseConfig, log } from '../common';
import { Database, sleep, checkTimeoutExpired } from '.';

export class DatabaseConnector {
  static SLEEP_INTERVAL_MILLIS = 500;

  constructor(public client: MongoClient) {}

  async connect(
    dbConfig: DatabaseConfig,
    reconnectTimeoutInSeconds: number,
  ): Promise<Database> {
    const uri = this.getDbConnectionUri(dbConfig);
    log(`Connecting to ${uri}...`);

    const startMillis = new Date().getTime();
    const reconnectTimeoutMillis = reconnectTimeoutInSeconds * 1000;
    let client: MongoClient | undefined;
    do {
      try {
        client = await MongoClient.connect(uri, { ignoreUndefined: true });
      } catch (err) {
        log(`${err.message}\nRetrying...`);
        await sleep(DatabaseConnector.SLEEP_INTERVAL_MILLIS);
        if (checkTimeoutExpired(startMillis, reconnectTimeoutMillis)) {
          throw new Error(
            `Timeout ${reconnectTimeoutInSeconds}s expired while connecting to database due to: ${
              err.name
            }: ${err.message}`,
          );
        }
      }
    } while (!client);

    log('Connection with database established.');
    this.client = client;
    const db = client.db(dbConfig.name);
    return new Database(db);
  }

  async close() {
    log('Closing connection...');
    if (!this.client) {
      return;
    }
    await this.client.close();
  }

  getDbConnectionUri = ({
    protocol,
    host,
    port,
    name,
    username,
    password,
  }: DatabaseConfig) => {
    let credentials = '';
    if (username) {
      credentials = `${username}${password ? `:${password}` : ''}@`;
    }
    return `${protocol}://${credentials}${host}:${port}/${name}`;
  };
}
