const express = require("express");
const router = express.Router();

//Middlewares
const { validateId } = require("../../middleware/validate-id");
const {
  validateRegisterUser,
  validateDuplicateUser,
  validateSignInUser,
  validateUpdateUser,
} = require("../../middleware/validate-user");
const {
  authenticateSignUp,
  authenticateSignIn,
} = require("../../middleware/validate-auth");
const { validateRol } = require("../../middleware/validate-rol");

//Controllers
const {
  allUsers,
  signUp,
  signIn,
  logout,
  updateUser,
  deleteUser,
} = require("./users.controller");

//Routes
router.get("/list", validateRol, allUsers);
router.post(
  "/signup",
  [validateRegisterUser, validateDuplicateUser, authenticateSignUp],
  signUp
);
router.post("/signin", [validateSignInUser, authenticateSignIn], signIn);
router.post("/logout", logout);
router.put(
  "/user/update/:_id",
  [validateRol, validateId, validateUpdateUser],
  updateUser
);
router.delete("/user/update/:_id", [validateRol, validateId], deleteUser);

module.exports = router;
