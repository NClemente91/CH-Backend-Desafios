const Joi = require("joi");
const { responseError } = require("../network/response");

//We validate that the status of the order exists and that it is correct
const validateStateOrder = async (req, res, next) => {
  const schema = Joi.object({
    state: Joi.string()
      .valid(
        "order generated",
        "order prepared",
        "order shipped",
        "order delivered"
      )
      .required(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

module.exports = {
  validateStateOrder,
};
