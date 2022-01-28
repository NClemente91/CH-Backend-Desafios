const bcrypt = require("bcryptjs");

//Method to encrypt the password
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//Method to match the password
const matchPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

module.exports = {
  encryptPassword,
  matchPassword,
};
