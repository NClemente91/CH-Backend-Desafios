const express = require("express");
const router = express.Router();

//Middlewares
const { validateId } = require("../../middleware/validate-id");
const {
  validateRegisterUser,
  validateUpdateUser,
} = require("../../middleware/validate-user");
const {
  authenticateSignUp,
  authenticateSignIn,
} = require("../../middleware/validate-auth");
const { validateRol } = require("../../middleware/validate-rol");

//Controllers
const {
  signUp,
  signIn,
  logout,
  updateUser,
  deleteUser,
} = require("./users.controller");

//Routes
router.post("/signup", [validateRegisterUser, authenticateSignUp], signUp);
router.post("/signin", authenticateSignIn, signIn);
router.post("/logout", logout);
router.put(
  "/user/update/:_id",
  [validateRol, validateId, validateUpdateUser],
  updateUser
);
router.delete("/user/update/:_id", [validateRol, validateId], deleteUser);

module.exports = router;
