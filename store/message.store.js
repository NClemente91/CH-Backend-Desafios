const pers = require("../persistencia/factory");

const findAllMessages = async () => {
  return await pers.getAllMessages();
};

const createMessage = async (msj) => {
  return await pers.postMessage(msj);
};

module.exports = {
  findAllMessages,
  createMessage,
};
