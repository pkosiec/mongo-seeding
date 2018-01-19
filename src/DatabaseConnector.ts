import { MongoClient, Db } from 'mongodb';
import { Database } from './Database';
import { sleep } from './helpers';
import { DatabaseConfig } from './config';
import { log } from './logger';

export class DatabaseConnector {
  static CONNECTION_REFUSED_ERROR_CODE = 'ECONNREFUSED';
  static DEFAULT_RECONNECT_TIMEOUT = 500;

  constructor(public client: MongoClient) {}

  async connect(
    dbConfig: DatabaseConfig,
    reconnectTimeout: number = DatabaseConnector.DEFAULT_RECONNECT_TIMEOUT,
  ): Promise<Database> {
    const uri = this.getDbConnectionUri(dbConfig);
    log(`Connecting to ${uri}...`);

    let client: MongoClient | undefined;
    do {
      try {
        client = await MongoClient.connect(uri, { ignoreUndefined: true });
      } catch (err) {
        if (
          !err.message.includes(DatabaseConnector.CONNECTION_REFUSED_ERROR_CODE)
        ) {
          throw err;
        }
        log(`${err.message} Retrying...`);
        await sleep(reconnectTimeout);
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

  getDbConnectionUri = ({ host, port, name, protocol }: DatabaseConfig) => {
    return `${protocol}://${host}:${port}/${name}`;
  };
}
