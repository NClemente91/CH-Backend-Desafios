const express = require("express");
require("dotenv").config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/productos", require("./routes/products.routes"));
    this.app.use("/carrito", require("./routes/cart.routes"));
    this.app.use("*", require("./routes/error.routes"));
  }

  start() {
    this.app.listen(this.port, () => {
      try {
        console.log(`Servidor conectado en puerto ${this.port}`);
      } catch (error) {
        console.log("Error de conexión", error);
      }
    });
  }
}

const server = new Server();

server.start();
