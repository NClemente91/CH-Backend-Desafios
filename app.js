const express = require("express");
const handlebars = require("express-handlebars");
path = require("path");

class Server {
  constructor() {
    this.app = express();
    this.port = 8080;

    this.middlewares();

    this.hand();

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

  hand = () => {
    //Configuración de handlebars
    this.app.engine(
      "hbs", //Nombre de referencia de la plantilla
      handlebars({
        extname: ".hbs", //Extensión a utilizar
        defaultLayout: "index.hbs", //Plantilla principal
        layoutsDir: __dirname + "/views/layouts", //Ruta a la plantilla gral
      })
    );

    //Establecemos el motor de plantilla que se utiliza
    this.app.set("view engine", ".hbs");

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
