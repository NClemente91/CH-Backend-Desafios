const passport = require("passport");

const { responseError } = require("../network/response");

const authenticateSignUp = (req, res, next) => {
  passport.authenticate(
    "signup",
    {
      session: false,
    },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      req.userRegister = user;
      return next();
    }
  )(req, res, next);
};

const authenticateSignIn = (req, res, next) => {
  passport.authenticate("signin", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return responseError(req, res, "Wrong username and/or password", 401);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

const authenticateToken = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return responseError(req, res, "Unauthorized access", 401);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = {
  authenticateSignUp,
  authenticateSignIn,
  authenticateToken,
};
