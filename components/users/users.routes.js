const express = require("express");
const router = express.Router();
const passport = require("passport");

//CONTROLLERS
const {
  renderSignUpForm,
  signUp,
  renderSignInForm,
  signIn,
  logout,
} = require("./users.controller");

//ROUTES
router.get("/signup", renderSignUpForm);

router.post(
  "/signup",
  passport.authenticate("signup", {
    session: false,
    failureRedirect: "/signup",
  }),
  signUp
);

router.get("/signin", renderSignInForm);

router.post(
  "/signin",
  passport.authenticate("signin", { failureRedirect: "/signin" }),
  signIn
);

router.get("/logout", logout);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user.user.email;
    res.json(user);
  }
);

module.exports = router;
