import { cliSeeder } from '../../src/index';
import { MongoClient } from 'mongodb';
import * as tsNode from 'ts-node';

console.error = jest.fn();
console.log = jest.fn();

describe('CLI', () => {
  const previousArgv = process.argv;

  beforeEach(() => {
    jest.resetModules();
    process.argv = { ...previousArgv };
  });

  afterEach(() => {
    process.argv = previousArgv;
  });

  it('should import data', async () => {
    const dbConnectionUri = process.env.DB_URI
      ? process.env.DB_URI
      : 'mongodb://127.0.0.1:27017/clidb';
    const databaseName = process.env.DB_NAME ? process.env.DB_NAME : 'clidb';

    const exit = jest.spyOn(process, 'exit').mockImplementation();

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

    expect(console.error).not.toBeCalled();
    expect(exit).toBeCalledWith(0);

    const client = await MongoClient.connect(dbConnectionUri, {
      ignoreUndefined: true,
      useNewUrlParser: true,
    });
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

  it('should show help', async () => {
    const exit = jest.spyOn(process, 'exit').mockImplementation();

    process.argv = ['', '', '--help'];
    await cliSeeder.run();

    expect(console.log).toBeCalledWith(
      expect.stringContaining('Mongo Seeding CLI'),
    );
    expect(exit).toBeCalledWith(0);
  });

  it('should exit without error when no data to import', async () => {
    const exit = jest.spyOn(process, 'exit').mockImplementation();

    process.argv = ['', '', './no-path'];
    await cliSeeder.run();
    expect(exit).toBeCalledWith(0);
  });

  it('should allow transpile only mode for TS files', async () => {
    const registerTsNode = jest.spyOn(tsNode, 'register');
    jest.spyOn(process, 'exit').mockImplementation();

    process.argv = ['', '', '--transpile-only', './no-path'];
    await cliSeeder.run();
    expect(registerTsNode).toBeCalledWith({
      transpileOnly: true,
    });
  });

  it('should exit with error on incorrect values', async () => {
    const exit = jest.spyOn(process, 'exit').mockImplementation();

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
      expect(exit).toBeCalledWith(0);
    }
  });

  it('should exit with error on command line arguments error', async () => {
    const exit = jest.spyOn(process, 'exit').mockImplementation();

    process.argv = ['', '', '--what-is-this-parameter', 'dunno'];
    await cliSeeder.run();

    expect(console.error).toBeCalledWith(
      expect.stringContaining('InvalidParameterError'),
    );
    expect(exit).toBeCalledWith(0);
  });
});
