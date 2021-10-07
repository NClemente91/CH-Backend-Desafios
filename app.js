const express = require("express");
const Io = require("socket.io");
const Http = require("http");
const dbConnection = require("./configs/mongodb");
path = require("path");
const Mensaje = require("./models/mensajes");
const Producto = require("./models/productos");
const normalizr = require("normalizr");
const util = require("util");

class Server {
  constructor() {
    this.app = express();
    //WS
    this.http = Http.Server(this.app);
    this.io = Io(this.http);
    //MONGODB
    this.dbConnection = dbConnection();
    //NORMALIZR
    this.normalize = normalizr.normalize;
    this.schema = normalizr.schema;
    //PUERTO
    this.port = 5050;

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

  normalizaMessages(data) {
    const newData = data.map((msg) => ({
      id: msg._id.toString(),
      author: msg.author,
      date: msg.date,
      text: msg.text,
    }));

    const authorSchema = new this.schema.Entity("authors");
    const messageSchema = new this.schema.Entity("messages", {
      author: authorSchema,
    });
    const messagesSchema = new this.schema.Array(messageSchema);

    return this.normalize(newData, messagesSchema);
  }

  ws() {
    this.io.on("connection", async (socket) => {
      console.log("Cliente conectado: " + socket.id);

      try {
        const productos = await Producto.find();

        socket.emit("productosExistentes", {
          value: productos,
        });

        socket.on("notificacion", async (data) => {
          if (data) {
            const newProductos = await Producto.find();
            this.io.sockets.emit("productosExistentes", {
              value: newProductos,
            });
          }
        });

        const messages = await Mensaje.find();
        const messagesLength = JSON.stringify(messages).length;

        //-----------NORMALIZR--------------//
        const newMessages = this.normalizaMessages(messages);
        const newMessagesLength = JSON.stringify(newMessages).length;
        const compresion = ((newMessagesLength * 100) / messagesLength).toFixed(
          0
        );
        //-----------NORMALIZR--------------//

        socket.emit("messages", { value: newMessages, compress: compresion });

        socket.on("new-message", async (data) => {
          await Mensaje.create(data);
          const newMessages = await Mensaje.find();
          const newMessagesLength = JSON.stringify(newMessages).length;
          const newMessagesN = this.normalizaMessages(newMessages);
          const newMessagesNLength = JSON.stringify(newMessagesN).length;
          const compresion = (
            (newMessagesNLength * 100) /
            newMessagesLength
          ).toFixed(0);
          this.io.sockets.emit("messages", {
            value: newMessagesN,
            compress: compresion,
          });
        });
      } catch (error) {
        console.log(error);
      }
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
