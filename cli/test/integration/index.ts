import { cliSeeder } from '../../src/index';
import { MongoClient } from 'mongodb';
import * as tsNode from 'ts-node';
import { DatabaseConnector } from 'mongo-seeding/dist/database';

describe('CLI', () => {
  const previousArgv = process.argv;
  const previousEnv = process.env;

  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let stdErrSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    process.argv = { ...previousArgv };
    process.env = { ...previousEnv };

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    stdErrSpy = jest.spyOn(process.stderr, 'write');
    exitSpy = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    process.argv = previousArgv;
    process.env = previousEnv;

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    stdErrSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should import data', async () => {
    const dbConnectionUri = process.env.DB_URI
      ? process.env.DB_URI
      : 'mongodb://127.0.0.1:27017/clidb';
    const databaseName = process.env.DB_NAME ? process.env.DB_NAME : 'clidb';

    process.argv = [
      '',
      '',
      '--replace-id',
      '--drop-collections',
      './test/integration/_importdata',
      '--db-uri',
      dbConnectionUri,
    ];

    await cliSeeder.run();

    expect(process.stderr.write).toBeCalled();
    expect(console.error).not.toBeCalled();
    expect(exitSpy).toBeCalledWith(0);

    const client = new MongoClient(dbConnectionUri, {
      ignoreUndefined: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
    });
    await client.connect();

    const db = client.db(databaseName);

    const testCases = [
      {
        collectionName: 'cliobjects',
        expectedLength: 3,
      },
      {
        collectionName: 'cliarrays',
        expectedLength: 6,
      },
    ];

    for (const testCase of testCases) {
      const collection = await db
        .collection(testCase.collectionName)
        .find()
        .toArray();

      expect(collection).toHaveLength(testCase.expectedLength);

      expect(collection).toContainEqual(
        expect.objectContaining({
          _id: 'onetest',
          number: 1,
          name: 'one',
        }),
      );
      expect(collection).toContainEqual(
        expect.objectContaining({
          number: 2,
          name: 'two',
        }),
      );
      expect(collection).toContainEqual({
        _id: 'threetest',
        number: 3,
        name: 'three',
      });
    }

    await client.close(true);
  });

  it('should import data silently', async () => {
    const dbConnectionUri = process.env.DB_URI
      ? process.env.DB_URI
      : 'mongodb://127.0.0.1:27017/clidb';

    process.argv = [
      '',
      '',
      '--replace-id',
      '--drop-collections',
      '--silent',
      './test/integration/_importdata',
      '--db-uri',
      dbConnectionUri,
    ];

    await cliSeeder.run();

    expect(process.stderr.write).not.toBeCalled();
    expect(console.error).not.toBeCalled();
    expect(consoleLogSpy).not.toBeCalled();
    expect(exitSpy).toBeCalledWith(0);
  });

  it('should show help without error', async () => {
    process.argv = ['', '', '--help'];
    await cliSeeder.run();

    expect(consoleLogSpy).toBeCalledWith(
      expect.stringContaining('Mongo Seeding CLI'),
    );
  });

  it('should exit without error when no data to import', async () => {
    process.argv = ['', '', './no-path'];
    await cliSeeder.run();
    expect(exitSpy).toBeCalledWith(0);
  });

  it('should allow transpile only mode for TS files', async () => {
    const registerTsNode = jest.spyOn(tsNode, 'register');

    process.argv = ['', '', '--transpile-only', './no-path'];
    await cliSeeder.run();
    expect(registerTsNode).toBeCalledWith(
      expect.objectContaining({
        transpileOnly: true,
      }),
    );

    registerTsNode.mockRestore();
  });

  it('should exit with error on incorrect values', async () => {
    const testCases = [
      {
        argv: ['', '', '--reconnect-timeout', '-5'],
      },
      {
        argv: ['', '', '--db-port', '-5'],
      },
    ];

    for (const testCase of testCases) {
      process.argv = testCase.argv;
      await cliSeeder.run();

      expect(console.error).toBeCalledWith(
        expect.stringContaining('InvalidParameterError'),
      );
      expect(exitSpy).toBeCalledWith(0);
    }
  });

  it('should exit with error on command line arguments error', async () => {
    process.argv = ['', '', '--what-is-this-parameter', 'dunno'];
    await cliSeeder.run();

    expect(console.error).toBeCalledWith(
      expect.stringContaining('Error UNKNOWN_OPTION'),
    );
    expect(exitSpy).toBeCalledWith(0);
  });
});
