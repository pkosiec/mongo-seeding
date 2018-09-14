const { ObjectId } = require('mongodb');
const { createHash } = require('crypto');

const mapToEntities = names => {
  return names.map(name => {
    const id = getObjectId(name);

    return {
      id,
      name,
    };
  });
};

const getObjectId = name => {
  const hash = createHash('sha1')
    .update(name, 'utf8')
    .digest('hex');

  return new ObjectId(hash.substring(0, 24));
};

const getObjectIds = names => {
  return names.map(name => getObjectId(name));
};

module.exports = {
  mapToEntities,
  getObjectId,
  getObjectIds,
};
