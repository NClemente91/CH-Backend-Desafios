const User = require("./users.model");

//Function that returns the users in MongoDB
const findAllUsers = async () => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return null;
    }
    return users;
  } catch (error) {
    throw new Error("Error searching all users");
  }
};

//Function that returns an user by its email and username in MongoDB
const findDuplicateUser = async (email, username) => {
  try {
    const userEmailExist = await User.find({ email });
    const userUsernameExist = await User.find({ username });
    if (userEmailExist.length !== 0 || userUsernameExist.length !== 0) {
      return true;
    }
    return null;
  } catch (error) {
    throw new Error("Error searching for an user");
  }
};

//Function that returns an user by its email in MongoDB
const findOneUser = async (email) => {
  try {
    const user = await User.find({ email });
    if (user.length === 0) {
      return null;
    }
    return user[0];
  } catch (error) {
    throw new Error("Error searching for an user");
  }
};

//Function to add an user to MongoDB
const createOneUser = async (user) => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (error) {
    throw new Error("Error adding an user");
  }
};

//Function to update an user by its id in MongoDB
const updateOneUserbyID = async (idu, user) => {
  try {
    const userUpdate = await User.findOneAndUpdate(
      { _id: idu },
      { ...user },
      { new: true }
    );
    if (!userUpdate) {
      return null;
    }
    return userUpdate;
  } catch (error) {
    throw new Error("Error updating an user");
  }
};

//Function to remove an user by its id in MongoDB
const deleteOneUserbyID = async (idu) => {
  try {
    const userDelete = await User.deleteOne({ _id: idu });
    if (userDelete.deletedCount === 1) {
      return;
    }
    return null;
  } catch (error) {
    throw new Error("Error removing an user");
  }
};

module.exports = {
  findAllUsers,
  findDuplicateUser,
  findOneUser,
  createOneUser,
  updateOneUserbyID,
  deleteOneUserbyID,
};
