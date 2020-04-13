import { NewLoggerInstance } from '../../src/common';

describe('log', () => {
  const previousEnvs = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...previousEnvs };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = previousEnvs;
  });

  jest.spyOn(process.stderr, 'write');

  it('should log to output when env is specified', () => {
    process.env.DEBUG = '';

    const log = NewLoggerInstance();
    log('nope');

    expect(process.stderr.write).not.toHaveBeenCalled();
  });

  it("shouldn't log to output when env is not specified", () => {
    process.env.DEBUG = 'mongo-seeding';

    const { NewLoggerInstance } = require('../../src/common');
    const log = NewLoggerInstance();

    log('test');

    expect(process.stderr.write).toHaveBeenCalledTimes(1);
    expect(process.stderr.write).toHaveBeenCalledWith(
      expect.stringContaining('test'),
    );
  });
});
