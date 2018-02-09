import { sleep, checkTimeoutExpired } from '../../src/helpers';

jest.useFakeTimers();

describe('Helper functions', () => {
  it('should wait given time', () => {
    const sleepTime = 500;
    sleep(sleepTime);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      sleepTime,
    );
  });

  it('should check if time expired', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedTimeout = new Date();
    expectedTimeout.setMinutes(expectedTimeout.getMinutes() - 1);

    expect(checkTimeoutExpired(tomorrow.getTime(), 5)).toBeFalsy();
    expect(checkTimeoutExpired(expectedTimeout.getTime(), 5)).toBeTruthy();
  });
});
