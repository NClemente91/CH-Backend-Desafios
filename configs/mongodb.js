const mongoose = require("mongoose");

const { loggerInfo, loggerWarn, loggerError } = require("./loggers");

const dbConnection = async () => {
  try {
    //CAMBIAR EL LINK
    await mongoose.connect(process.env.MONGO_URL);
    loggerInfo.info("BD Conectada");
  } catch (error) {
    loggerInfo.info(`Error de conección de BD ${error}`);
    loggerError.error(`Error de conección de BD ${error}`);
  }
};

module.exports = dbConnection;
