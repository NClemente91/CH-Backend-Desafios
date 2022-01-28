const Joi = require("joi");
const { responseError } = require("../network/response");

//We validate the data for a new message
const validateAddMessageChat = async (req, res, next) => {
  const schema = Joi.object({
    typeUser: Joi.string().valid("user", "system").required(),
    message: Joi.string().required(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

module.exports = {
  validateAddMessageChat,
};
