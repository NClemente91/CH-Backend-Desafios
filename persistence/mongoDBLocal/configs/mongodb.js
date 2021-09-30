const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    //CAMBIAR EL LINK
    await mongoose.connect("mongodb://localhost:27017/proyectoFinal");
    console.log("BD Conectada");
  } catch (error) {
    console.log("Error");
  }
};

module.exports = dbConnection;
