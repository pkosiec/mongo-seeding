const getObjectId = require("../../helpers/index").getObjectId;

const name = "Additional Category";

module.exports = {
    id: getObjectId(name),
    name,
}
