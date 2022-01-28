const Joi = require("joi");
const { responseError } = require("../network/response");

//We validate that there is an amount to add or update a product
const validateQuantityProduct = async (req, res, next) => {
  const schema = Joi.object({
    quantity: Joi.number().min(1).required(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

module.exports = {
  validateQuantityProduct,
};
