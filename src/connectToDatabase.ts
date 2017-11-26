import { MongoClient, Db } from 'mongodb';
import { DatabaseConfig } from './config';

const CONNECTION_REFUSED_ERROR_CODE = 'ECONNREFUSED';

const sleep = (time: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, time));

export const connectToDatabase = async (
  { host, port, name, protocol }: DatabaseConfig,
  reconnectTimeout: number,
  log: (message: string) => void,
): Promise<Db> => {
  const uri = `${protocol}://${host}:${port}/${name}`;
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
