const { responseSuccess, responseError } = require("../../network/response");

const { findMessagesUser, addOneMessage } = require("./chat.store");

//PARA VER LOS MENSAJES PROPIOS
const allMessages = async (req, res) => {
  try {
    const email = req.user.email;
    const messages = await findMessagesUser(email);
    if (messages !== null) {
      return responseSuccess(req, res, null, 200, messages);
    } else {
      return responseError(req, res, "Messages Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA MANDAR UN MSJ AL CHAT
const addMessage = async (req, res) => {
  try {
    const email = req.user.email;
    const type = req.body.type;
    const message = req.body.message;
    const messageAdded = await addOneMessage(email, type, message);
    if (messageAdded !== null) {
      return responseSuccess(req, res, null, 200, messageAdded);
    } else {
      return responseError(req, res, "Message Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

module.exports = { allMessages, addMessage };
