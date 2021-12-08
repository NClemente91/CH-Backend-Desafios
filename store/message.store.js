const Mensaje = require("../persistencia/mensajes");

const findAllMessages = async () => {
  return await Mensaje.find();
};

const createMessage = async (msj) => {
  return await Mensaje.create(msj);
};

module.exports = {
  findAllMessages,
  createMessage,
};
