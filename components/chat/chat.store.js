const Chat = require("./chat.model");

//Function that returns the messages of a user in MongoDB
const findMessagesUser = async (email) => {
  try {
    const messages = await Chat.find({ email });
    if (messages.length === 0) {
      return null;
    }
    return messages;
  } catch (error) {
    throw new Error("Error searching for a user's messages");
  }
};

//Function to add a message to MongoDB
const addOneMessage = async (email, type, message) => {
  try {
    const newMessage = {
      email,
      typeUser: type,
      message,
    };
    const addMessage = await Chat.create(newMessage);
    return addMessage;
  } catch (error) {
    throw new Error("Error adding a message");
  }
};

module.exports = { findMessagesUser, addOneMessage };
