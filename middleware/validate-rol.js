const { responseError } = require("../network/response");

const administrador = true;

//We validate the rol of the user
const validateRol = (req, res, next) => {
  try {
    if (administrador) {
      return next();
    } else {
      return responseError(
        req,
        res,
        `Ruta ${
          req.headers.host + req.originalUrl
        } Metodo ${req.method.toUpperCase()}  no autorizada`,
        403
      );
    }
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

module.exports = {
  validateRol,
};
