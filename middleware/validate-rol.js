const administrador = true;

//VALIDAMOS EL ROL
const validateRol = (req, res, next) => {
  try {
    if (administrador) {
      return next();
    } else {
      return res.status(403).json({
        code: "ERR",
        message: `Ruta ${
          req.headers.host + req.originalUrl
        } Metodo ${req.method.toUpperCase()}  no autorizada`,
        success: false,
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: "ERROR",
      message: error.message,
      success: false,
      data: null,
    });
  }
};

module.exports = {
  validateRol,
};
