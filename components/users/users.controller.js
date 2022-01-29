const jwt = require("jsonwebtoken");
const config = require("../../configs/config");
const { emailRegister } = require("../../configs/node-gmail");

const { responseSuccess, responseError } = require("../../network/response");

const {
  findAllUsers,
  updateOneUserbyID,
  deleteOneUserbyID,
} = require("./users.store");

//Show all users (Only available for administrator)
const allUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    if (users !== null) {
      return responseSuccess(req, res, null, 200, users);
    }
    return responseError(req, res, "Users not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to register a new user
const signUp = (req, res) => {
  try {
    const userRegister = req.userRegister;
    emailRegister(userRegister);
    return responseSuccess(req, res, "Signup successful", 200, null);
  } catch (error) {
    return responseError(req, res, err.message, 500);
  }
};

//Allows an existing user to login
const signIn = (req, res) => {
  try {
    req.login(req.user, { session: false }, (error) => {
      if (error) {
        return responseError(req, res, err.message, 500);
      }
      const message = "Signin successful";
      const body = {
        _id: req.user._id,
        email: req.user.email,
        address: req.user.address,
      };
      const token = jwt.sign({ user: body }, config.SECRET, {
        expiresIn: config.TOKEN_EXPIRE,
      });
      return responseSuccess(req, res, message, 200, { body, token });
    });
  } catch (error) {
    return responseError(req, res, err.message, 500);
  }
};

//Allows to log out an active user
const logout = (req, res) => {
  try {
    const newSecret = `${config.SECRET}expire`;
    const body = { _id: "", email: "", address: "" };
    const token = jwt.sign({ user: body }, newSecret, {
      expiresIn: 10,
    });
    req.logOut();
    return responseSuccess(req, res, "Logout successful", 200, { token });
  } catch (error) {
    return responseError(req, res, err.message, 500);
  }
};

//Allows you to update a user. Only update address, age, phoneNumber or avatar
const updateUser = async (req, res) => {
  try {
    const idu = req.params._id;
    const userUpdate = await updateOneUserbyID(idu, req.body);
    if (userUpdate !== null) {
      return responseSuccess(req, res, null, 200, userUpdate);
    }
    return responseError(req, res, "User not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to delete a user
const deleteUser = async (req, res) => {
  try {
    const idu = req.params._id;
    const userDelete = await deleteOneUserbyID(idu);
    if (userDelete !== null) {
      return responseSuccess(req, res, null, 200, userDelete);
    }
    return responseError(req, res, "User not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

module.exports = {
  allUsers,
  signUp,
  signIn,
  logout,
  updateUser,
  deleteUser,
};
