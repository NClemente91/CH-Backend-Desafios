const express = require("express");
const router = express.Router();

//MIDDLEWARES
const {
  authenticateSignUp,
  authenticateSignIn,
  authenticateToken,
} = require("../../middleware/authorization");

//CONTROLLERS
const { signUp, signIn, logout } = require("./users.controller");

//ROUTES
router.post("/signup", authenticateSignUp, signUp);

router.post("/signin", authenticateSignIn, signIn);

router.post("/logout", logout);

module.exports = router;
