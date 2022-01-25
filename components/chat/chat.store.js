const Chat = require("./chat.model");

const findMessagesUser = async (email) => {
  try {
    const messages = await Chat.find({ email, typeUser: "user" });
    if (!messages) {
      return null;
    } else {
      return messages;
    }
  } catch (error) {
    throw new Error("Error al listar los mensajes de chat de un usuario");
  }
};

const addOneMessage = async (email, type, message) => {
  try {
    if (email && type && message) {
      const newMessage = {
        email,
        typeUser: type,
        message,
      };
      const addMessage = await Chat.create(newMessage);
      return addMessage;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error al guardar un mensaje de chat de un usuario");
  }
};

module.exports = { findMessagesUser, addOneMessage };
