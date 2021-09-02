const express = require("express");
const Io = require("socket.io");
const Http = require("http");
const path = require("path");
let productos = require("./productos.json");
let messages = require("./messages.json");

class Server {
  app;
  http;
  io;
  port;
  productos;

  constructor() {
    this.app = express();
    this.http = Http.Server(this.app);
    this.io = Io(this.http);
    this.port = 5050;
    this.productos = productos;

    this.middlewares();

    this.ejs();

    this.ws();

    this.routes();
  }

  middlewares() {
    this.app.use(express.static(__dirname + "/public"));
  }

  routes() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/api", require("./routes/productos.routes"));
  }

  ejs() {
    //Establecemos el motor de plantilla que se utiliza
    this.app.set("view engine", "ejs");

    //Establecemos el directorio donde se encuentran los archivos de plantilla
    this.app.set("views", "./views");
  }

  ws() {
    this.io.on("connection", (socket: any) => {
      console.log("Cliente conectado: " + socket.id);

      socket.emit("productosExistentes", { value: productos });

      socket.on("notificacion", (data: any) => {
        if (data) {
          this.io.sockets.emit("productosExistentes", { value: productos });
        }
      });

      socket.emit("messages", messages);

      socket.on("new-message", (data: any) => {
        messages.push(data);
        this.io.sockets.emit("messages", messages);
      });
    });
  }

  start() {
    this.http.listen(this.port, () => {
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
