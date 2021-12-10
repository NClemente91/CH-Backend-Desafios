const express = require("express");
const Io = require("socket.io");
const Http = require("http");
const cors = require("cors");
path = require("path");
const { findAllMessages, createMessage } = require("./store/message.store");
const { findAllProduct } = require("./store/products.store");
const normalizr = require("normalizr");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

class Server {
  constructor() {
    this.app = express();
    //WS
    this.http = Http.Server(this.app);
    this.io = Io(this.http);
    //NORMALIZR
    this.normalize = normalizr.normalize;
    this.schema = normalizr.schema;
    //PUERTO
    this.port = process.env.PORT || 5000;

    this.session();

    this.middlewares();

    this.passportP();

    this.ejs();

    this.ws();

    this.routes();
  }

  passportP() {
    require("./configs/passport");
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.static(__dirname + "/public"));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  session() {
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl:
            "mongodb+srv://BackCH:BackCH@cluster0.sh7lt.mongodb.net/test",
          ttl: 600,
        }),
        secret: "desafio25",
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
          maxAge: 600000,
        },
      })
    );
  }

  routes() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //Rutas Users
    this.app.use("/", require("./routes/users.routes"));

    //Rutas Productos
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
      hora: msg.hora,
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
        const productos = await findAllProduct();

        socket.emit("productosExistentes", {
          value: productos,
        });

        socket.on("notificacion", async (data) => {
          if (data) {
            const newProductos = await findAllProduct();
            this.io.sockets.emit("productosExistentes", {
              value: newProductos,
            });
          }
        });

        const messages = await findAllMessages();
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
          createMessage(data);
          const newMessages = await findAllMessages();
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
