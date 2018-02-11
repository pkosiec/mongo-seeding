export const log = require('debug')('mongo-seeding');

export const sleep = (millis: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, millis));

export const checkTimeoutExpired = (
  startMillis: number,
  reconnectTimeoutMillis: number,
) => {
  return new Date().getTime() - startMillis >= reconnectTimeoutMillis;
};
