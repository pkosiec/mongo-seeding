import { MongoClient, Db } from 'mongodb';
import { DatabaseConfig } from './config';
import { sleep } from './helpers';

const CONNECTION_REFUSED_ERROR_CODE = 'ECONNREFUSED';

export class DatabaseConnector {
  constructor(
    public client: MongoClient,
    public log: (message: string) => void,
  ) {}

  getDbConnectionUri = ({ host, port, name, protocol }: DatabaseConfig) => {
    return `${protocol}://${host}:${port}/${name}`;
  };

  connect = async (
    dbConfig: DatabaseConfig,
    reconnectTimeout: number,
  ): Promise<Db> => {
    const uri = this.getDbConnectionUri(dbConfig);
    this.log(`Connecting to ${uri}...`);

    let db: Db | undefined;
    do {
      try {
        db = await MongoClient.connect(uri, { ignoreUndefined: true });
        this.log('Connection with database established.');
      } catch (err) {
        if (!err.message.includes(CONNECTION_REFUSED_ERROR_CODE)) {
          throw err;
        }
        this.log(`${err.message} Retrying...`);
        await sleep(reconnectTimeout);
      }
    } while (!db);

    return db;
  };
}
