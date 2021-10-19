const express = require("express");
const Io = require("socket.io");
const Http = require("http");
const dbConnection = require("./configs/mongodb");
path = require("path");
const Mensaje = require("./models/mensajes");
const Producto = require("./models/productos");
const User = require("./models/users");
const normalizr = require("normalizr");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bCrypt = require("bcrypt");
const passport = require("passport");
const passportLocal = require("passport-local");

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
    //PASSPORT
    this.passport = passport;
    this.LocalStrategy = passportLocal.Strategy;
    //PUERTO
    this.port = 5050;

    this.session();

    this.passportS();

    this.middlewares();

    this.ejs();

    this.ws();

    this.routes();
  }

  middlewares() {
    this.app.use(cookieParser());
    this.app.use(express.static(__dirname + "/public"));
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

  passportS() {
    this.passport.use(
      "login",
      new this.LocalStrategy({ passReqToCallback: true }, function (
        req,
        username,
        password,
        done
      ) {
        // check in mongo if a user with username exists or not
        User.findOne({ username: username }, (err, user) => {
          // In case of any error, return using the done method
          if (err) return done(err);
          // Username does not exist, log error & redirect back
          if (!user) {
            console.log("User Not Found with username " + username);
            console.log("message", "User Not found.");
            return done(null, false);
          }
          // User exists but wrong password, log the error
          if (!isValidPassword(user, password)) {
            console.log("Invalid Password");
            console.log("message", "Invalid Password");
            return done(null, false);
          }
          // User and password both match, return user from
          // done method which will be treated like success
          return done(null, user);
        });
      })
    );

    var isValidPassword = function (user, password) {
      return bCrypt.compareSync(password, user.password);
    };

    this.passport.use(
      "register",
      new this.LocalStrategy({ passReqToCallback: true }, function (
        req,
        username,
        password,
        done
      ) {
        const findOrCreateUser = function () {
          User.findOne({ username: username }, (err, user) => {
            // In case of any error return
            if (err) {
              console.log("Error in SignUp: " + err);
              return done(err);
            }
            // already exists
            if (user) {
              console.log("User already exists");
              console.log("message", "User Already Exists");
              return done(null, false);
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();
              // set the user's local credentials
              newUser.username = username;
              newUser.password = createHash(password);

              // save the user
              newUser.save(function (err) {
                if (err) {
                  console.log("Error in Saving user: " + err);
                  throw err;
                }
                console.log("User Registration succesful");
                return done(null, newUser);
              });
            }
          });
        };
        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
      })
    );

    const createHash = (password) => {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    this.passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    this.passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });
  }

  routes() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/", require("./routes/log.routes"));
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
