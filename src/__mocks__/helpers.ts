export const sleep = jest.fn().mockReturnValue(
  new Promise((resolve, reject) => {
    resolve();
  }),
);
