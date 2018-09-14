const { getObjectId } = require('../../helpers/index');

const name = 'Additional Category';

module.exports = {
  id: getObjectId(name),
  name,
};
