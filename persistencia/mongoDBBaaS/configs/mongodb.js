const mongoose = require("mongoose");
const config = require("../../../configs/config");

const dbConnection = async () => {
  try {
    //CAMBIAR EL LINK
    await mongoose.connect(config.STORE_SESSION);
    console.log("BD Conectada");
  } catch (error) {
    console.log("Error");
  }
};

module.exports = dbConnection;
