const Joi = require("joi");
const { responseError } = require("../network/response");

const { findDuplicateUser } = require("../components/users/users.store");

//We validate the data for a new user
const validateRegisterUser = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
    address: Joi.string().required(),
    age: Joi.number().positive().required(),
    phoneNumber: Joi.string().required(),
    avatar: Joi.string(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

//We validate that there is no duplicate data
const validateDuplicateUser = async (req, res, next) => {
  const userExist = await findDuplicateUser(req.body.email, req.body.username);
  if (userExist) {
    return responseError(req, res, "Email or username is not available", 403);
  }
  return next();
};

//We validate the data for sign in
const validateSignInUser = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

//We validate the data to update an existing user (only update address or age or phoneNumber or avatar)
const validateUpdateUser = async (req, res, next) => {
  const schema = Joi.object({
    address: Joi.string(),
    age: Joi.number().positive(),
    phoneNumber: Joi.string(),
    avatar: Joi.string(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

module.exports = {
  validateRegisterUser,
  validateDuplicateUser,
  validateSignInUser,
  validateUpdateUser,
};
