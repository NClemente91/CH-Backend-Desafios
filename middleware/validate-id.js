const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { responseError } = require("../network/response");

//We validate that the id is an objectid
const validateId = async (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.objectId(),
    id_productCart: Joi.objectId(),
    id_product: Joi.objectId(),
    id_order: Joi.objectId(),
  });

  try {
    await schema.validateAsync(req.params);
    return next();
  } catch (error) {
    return responseError(req, res, error.details[0].message, 400);
  }
};

module.exports = { validateId };
