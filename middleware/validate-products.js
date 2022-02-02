const Joi = require("joi");
const { responseError } = require("../network/response");

//We validate that the category exists
const validateCategory = async (req, res, next) => {
  const schema = Joi.object({
    _category: Joi.string().valid("frutas", "verduras"),
  });

  try {
    await schema.validateAsync(req.params);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

//We validate the data for a new product
const validateAddProduct = async (req, res, next) => {
  const schema = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    photo: Joi.string().required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

//We validate the data to update an existing product (only update photo or price or stock)
const validateUpdateProduct = async (req, res, next) => {
  const schema = Joi.object({
    photo: Joi.string(),
    price: Joi.number(),
    stock: Joi.number(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

module.exports = {
  validateCategory,
  validateAddProduct,
  validateUpdateProduct,
};
