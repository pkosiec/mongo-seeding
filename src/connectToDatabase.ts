import { MongoClient, Db } from 'mongodb';
import { DatabaseConfig } from './config';

const RECONNECT_TIMEOUT = 2000;
const CONNECTION_REFUSED_ERROR_CODE = 'ECONNREFUSED';

const sleep = (time: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, time));

export const connectToDatabase = async (
  { host, port, name, protocol }: DatabaseConfig,
  debugLogging: boolean,
  TAG: string,
): Promise<Db> => {
  const uri = `${protocol}://${host}:${port}/${name}`;
  debugLogging && console.log(TAG, `Connecting to ${uri}...`);

  let db: Db | undefined;
  do {
    try {
      db = await MongoClient.connect(uri, { ignoreUndefined: true });
      debugLogging && console.log(TAG, 'Connection with database established.');
    } catch (err) {
      if (!err.message.includes(CONNECTION_REFUSED_ERROR_CODE)) {
        throw err;
      }
      debugLogging && console.log(TAG, `${err.message} Retrying...`);
      await sleep(RECONNECT_TIMEOUT);
    }
  } while (!db);

  return db;
};
