const { getObjectId, getObjectIds } = require('mongo-seeding');

const mapToEntities = (names) => {
  return names.map((name) => {
    const id = getObjectId(name);

    return {
      id,
      name,
    };
  });
};

module.exports = {
  mapToEntities,
  getObjectId,
  getObjectIds,
};
