const express = require("express");
path = require("path");

class Server {
  constructor() {
    this.app = express();
    this.port = 8080;

    this.middlewares();

    this.pug();

    this.routes();
  }

  middlewares = () => {
    this.app.use(express.static(__dirname + "/public"));
  };

  routes = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/api", require("./routes/productos.routes"));
  };

  pug = () => {
    //Establecemos el motor de plantilla que se utiliza
    this.app.set("view engine", "pug");

    //Establecemos el directorio donde se encuentran los archivos de plantilla
    this.app.set("views", "./views");
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
