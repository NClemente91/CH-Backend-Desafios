const express = require("express");

class Server {
  constructor() {
    this.app = express();
    this.port = 8080;

    this.middlewares();

    this.routes();
  }

  middlewares = () => {
    this.app.use(express.static("public"));
  };

  routes = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/api", require("./routes/productos.routes"));
  };

  start = () => {
    this.app.listen(this.port, () => {
      try {
        console.log(`Servidor conectado en puerto ${this.port}`);
      } catch (error) {
        console.log("Error de conexión", error);
      }
    });
  };
}

const server = new Server();

server.start();
