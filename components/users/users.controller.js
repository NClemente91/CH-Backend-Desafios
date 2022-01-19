const jwt = require("jsonwebtoken");
const config = require("../../configs/config");

const { responseSuccess, responseError } = require("../../network/response");

const signUp = (req, res) => {
  try {
    const message = "Signup successful";
    const data = { user: req.user };
    return responseSuccess(req, res, message, 200, data);
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
      const body = { _id: req.user._id, email: req.user.email };
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
    const body = { _id: "", email: "" };
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