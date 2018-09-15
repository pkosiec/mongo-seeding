import { throwOnNegativeNumber } from '../../src/validators';

describe('Validators', () => {
  it('should throw on negative values only', () => {
    expect(() => throwOnNegativeNumber(-100, 'error')).toThrow();

    expect(() => throwOnNegativeNumber(undefined, 'ok')).not.toThrow();
    expect(() => throwOnNegativeNumber(0, 'error')).not.toThrow();
    expect(() => throwOnNegativeNumber(1, 'ok')).not.toThrow();
    expect(() => throwOnNegativeNumber(10000, 'ok')).not.toThrow();
  });
});
