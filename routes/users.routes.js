const express = require("express");
const router = express.Router();
const passport = require("passport");

//Controllers
const {
  getlogin,
  postLogin,
  failLogin,
  getRegister,
  failRegister,
  logout,
} = require("../controllers/users.controller");

//Login
router.get("/login", getlogin);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  postLogin
);

router.get("/faillogin", failLogin);

//REGISTER
router.get("/register", (req, res) => {
  res.sendFile(process.cwd() + "/public/register.html");
});

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  getRegister
);

router.get("/failregister", failRegister);

//Logout
router.get("/logout", logout);

module.exports = router;
