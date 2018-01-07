import { MongoClient, Db } from 'mongodb';
import { DatabaseConfig } from './config';
import { sleep } from './sleep';

const CONNECTION_REFUSED_ERROR_CODE = 'ECONNREFUSED';

export const getDbConnectionUri = ({
  host,
  port,
  name,
  protocol,
}: DatabaseConfig) => {
  return `${protocol}://${host}:${port}/${name}`;
};

export const connectToDatabase = async (
  dbConfig: DatabaseConfig,
  reconnectTimeout: number,
  log: (message: string) => void,
): Promise<Db> => {
  const uri = getDbConnectionUri(dbConfig);
  log(`Connecting to ${uri}...`);

  let db: Db | undefined;
  do {
    try {
      db = await MongoClient.connect(uri, { ignoreUndefined: true });
      log('Connection with database established.');
    } catch (err) {
      if (!err.message.includes(CONNECTION_REFUSED_ERROR_CODE)) {
        throw err;
      }
      log(`${err.message} Retrying...`);
      await sleep(reconnectTimeout);
    }
  } while (!db);

  return db;
};
