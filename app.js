const express = require("express");
const Io = require("socket.io");
const Http = require("http");
path = require("path");
const knex = require("knex");
const { optionsMsj } = require("./options/SQLite3");
const { optionsMDB } = require("./options/mariaDB");

class Server {
  constructor() {
    this.app = express();
    this.http = Http.Server(this.app);
    this.io = Io(this.http);
    this.port = 5050;
    this.knexMsj = knex(optionsMsj);
    this.knexMDB = knex(optionsMDB);

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
    this.knexMsj.schema
      .hasTable("messages")
      .then((exists) => {
        if (!exists) {
          return this.knexMsj.schema
            .createTable("messages", (table) => {
              table.string("author").notNullable();
              table.string("hora").notNullable();
              table.string("text").notNullable();
              table.integer("habilitado");
            })
            .then(() => console.log("Tabla de mensajes creada"))
            .catch((err) => console.log(err));
        } else {
          console.log("Tabla mensajes ya existe");
        }
      })
      .catch((err) => console.log(err));

    this.io.on("connection", (socket) => {
      console.log("Cliente conectado: " + socket.id);

      this.knexMDB("products")
        .select("title", "price", "thumbnail")
        .where({ habilitado: 1 })
        .then((resultado) => {
          const resultadoJson = JSON.parse(JSON.stringify(resultado));
          socket.emit("productosExistentes", { value: resultadoJson });
        })
        .catch((err) => {
          console.log(err);
        });

      socket.on("notificacion", (data) => {
        if (data) {
          this.knexMDB("products")
            .select("title", "price", "thumbnail")
            .where({ habilitado: 1 })
            .then((resultado) => {
              const resultadoJson = JSON.parse(JSON.stringify(resultado));
              this.io.sockets.emit("productosExistentes", {
                value: resultadoJson,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });

      this.knexMsj("messages")
        .select("author", "hora", "text")
        .where({ habilitado: 1 })
        .then((resultado) => {
          socket.emit("messages", resultado);
        })
        .catch((err) => {
          console.log(err);
        });

      socket.on("new-message", (data) => {
        const bodyMsj = data;
        bodyMsj.habilitado = 1;
        this.knexMsj("messages")
          .insert(bodyMsj)
          .then(() => {
            this.knexMsj("messages")
              .select("author", "hora", "text")
              .where({ habilitado: 1 })
              .then((resultado) => {
                this.io.sockets.emit("messages", resultado);
              });
          })
          .catch((err) => {
            console.log(err);
          });
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
