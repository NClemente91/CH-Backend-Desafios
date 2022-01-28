const User = require("./users.model");

//Function that returns an user by its email in MongoDB
const findOneUser = async (email) => {
  try {
    const user = await User.find({ email });
    if (!user) {
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
    const newUser = await Product.create(user);
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
  findOneUser,
  createOneUser,
  updateOneUserbyID,
  deleteOneUserbyID,
};
