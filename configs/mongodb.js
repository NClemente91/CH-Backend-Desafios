const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    //CAMBIAR EL LINK
    await mongoose.connect(
      "mongodb+srv://BackCH:BackCH@cluster0.sh7lt.mongodb.net/test"
    );
    console.log("BD Conectada");
  } catch (error) {
    console.log("Error");
  }
};

module.exports = dbConnection;
