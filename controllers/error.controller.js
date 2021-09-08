const getError = (req, res) => {
  return res.status(404).json({
    code: "ERR",
    message: `Ruta ${
      req.headers.host + req.originalUrl
    } Metodo ${req.method.toUpperCase()}  Not Found`,
    success: false,
    data: null,
  });
};

module.exports = { getError };
