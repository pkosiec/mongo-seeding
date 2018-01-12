import { MongoClient, Db } from 'mongodb';
import { Database } from './Database';
import { sleep } from './helpers';
import { DatabaseConfig } from './config';
import { log } from './logger';

const CONNECTION_REFUSED_ERROR_CODE = 'ECONNREFUSED';

export class DatabaseConnector {
  constructor(public client: MongoClient) {}

  connect = async (
    dbConfig: DatabaseConfig,
    reconnectTimeout: number,
  ): Promise<Database> => {
    const uri = this.getDbConnectionUri(dbConfig);
    log(`Connecting to ${uri}...`);

    let db: Db | undefined;
    do {
      try {
        db = await MongoClient.connect(uri, { ignoreUndefined: true });
      } catch (err) {
        if (!err.message.includes(CONNECTION_REFUSED_ERROR_CODE)) {
          throw err;
        }
        log(`${err.message} Retrying...`);
        await sleep(reconnectTimeout);
      }
    } while (!db);

    log('Connection with database established.');
    return new Database(db);
  };

  getDbConnectionUri = ({ host, port, name, protocol }: DatabaseConfig) => {
    return `${protocol}://${host}:${port}/${name}`;
  };
}

export const databaseConnector = new DatabaseConnector(MongoClient);
