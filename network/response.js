const { loggerInfo, loggerError } = require("../configs/loggers");

const responseSuccess = (req, res, message, status, data) => {
  let statusCode = status;

  if (!status) {
    status = 200;
  }

  res.status(statusCode).json({
    code: "OK",
    message,
    success: true,
    data,
  });
};

const responseError = (req, res, message, status) => {
  loggerInfo.info(`Response error ${message}`);
  loggerError.error(`Response error ${message}`);

  res.status(status || 500).json({
    code: "ERR",
    message,
    success: false,
    data: null,
  });
};

module.exports = { responseSuccess, responseError };
