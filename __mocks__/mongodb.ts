const connectionRefusedError = {
  name: 'MongoNetworkError',
  message:
    'failed to connect to server [127.0.0.1:27017] on first connect [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]',
};

const MongoClient = {
  connect: jest
    .fn()
    .mockReturnValueOnce(
      new Promise((resolve, reject) => reject(connectionRefusedError)),
    )
    .mockReturnValueOnce(
      new Promise((resolve, reject) => reject(connectionRefusedError)),
    )
    .mockReturnValue(new Promise((resolve, reject) => resolve({}))),
};

module.exports = { MongoClient };
