const { responseSuccess, responseError } = require("../../network/response");

const { findMessagesUser, addOneMessage } = require("./chat.store");

//Show all messages of a user
const allMessages = async (req, res) => {
  try {
    //If you want to use the endpoit with another frontend comment this line and uncomment the lines below
    res.sendFile(process.cwd() + "/public/chat.html");
    // const email = req.user.email;
    // const messages = await findMessagesUser(email);
    // if (messages !== null) {
    //   return responseSuccess(req, res, null, 200, messages);
    // }
    // return responseError(req, res, "Messages not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to add a new message
const addMessage = async (req, res) => {
  try {
    const email = req.user.email;
    const type = req.body.type;
    const message = req.body.message;
    const messageAdded = await addOneMessage(email, type, message);
    return responseSuccess(req, res, null, 200, messageAdded);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

module.exports = { allMessages, addMessage };
