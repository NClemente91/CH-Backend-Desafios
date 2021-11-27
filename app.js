const express = require("express");
const cors = require("cors");
require("dotenv").config();

const router = require("./network/routes");
const dbConnection = require("./configs/mongodb");

const app = express();

dbConnection();
app.use(cors());
app.use(express.json());

router(app);

const port = process.env.PORT;

app.listen(port, () => {
  try {
    console.log(`Servidor conectado en puerto ${port}`);
  } catch (error) {
    console.log("Error de conexión", error);
  }
});
