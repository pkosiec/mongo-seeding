import { sleep } from '../src/helpers';

jest.useFakeTimers();

describe('Testing helper functions', () => {
  it('should wait given time', () => {
    const sleepTime = 500;
    sleep(sleepTime);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      sleepTime,
    );
  });
});
