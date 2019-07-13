/**
 * Sleeps for a given time.
 *
 * @param millis Time in milliseconds
 */
export const sleep = (millis: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, millis));

/**
 * Checks if the timeout occurred.
 *
 * @param startTimeMillis Start time value in milliseconds
 * @param maxDurationMillis Maximum duration in milliseconds
 */
export const checkTimeout = (
  startTimeMillis: number,
  maxDurationMillis: number,
) => {
  return new Date().getTime() - startTimeMillis >= maxDurationMillis;
};
