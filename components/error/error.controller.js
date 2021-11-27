const { responseError } = require("../../network/response");

const getError = (req, res) => {
  const message = `Ruta ${
    req.headers.host + req.originalUrl
  } Metodo ${req.method.toUpperCase()}  Not Found`;
  return responseError(req, res, message, 404);
};

module.exports = { getError };
