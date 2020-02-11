const { getObjectId } = require('mongo-seeding');

const name = 'Additional Category';

module.exports = {
  id: getObjectId(name),
  name,
};
