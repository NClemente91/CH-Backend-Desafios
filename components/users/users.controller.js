const jwt = require("jsonwebtoken");
const config = require("../../configs/config");
const { emailRegister } = require("../../configs/node-gmail");

const { responseSuccess, responseError } = require("../../network/response");

const signUp = (req, res) => {
  try {
    const message = "Signup successful";
    const userRegister = req.userRegister;
    emailRegister(userRegister);
    return responseSuccess(req, res, message, 200, null);
  } catch (error) {
    return responseError(req, res, err.message, 500);
  }
};

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

const logout = (req, res) => {
  try {
    const newSecret = `${config.SECRET}expire`;
    const body = { _id: "", email: "", address: "" };
    const token = jwt.sign({ user: body }, newSecret, {
      expiresIn: 10,
    });
    const message = "Logout successful";
    req.logOut();
    return responseSuccess(req, res, message, 200, { token });
  } catch (error) {
    return responseError(req, res, err.message, 500);
  }
};

module.exports = {
  signUp,
  signIn,
  logout,
};
