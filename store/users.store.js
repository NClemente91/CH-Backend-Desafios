const pers = require("../persistencia/factory");

const findOneUser = async (id) => {
  return await pers.getOneUser();
};

const createUser = async (user) => {
  return await pers.postOneUser(user);
};

module.exports = {
  findOneUser,
  createUser,
};
