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
const LocalStrategy = require("passport-local");

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

    this.session();

    this.middlewares();

    this.passportP();

    this.ejs();

    this.ws();

    this.routes();
  }

  passportP() {
    passport.use(
      "login",
      new LocalStrategy(
        {
          passReqToCallback: true,
        },
        (req, username, password, done) => {
          User.findOne({ username: username }, (err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              console.log("User Not Found with username " + username);
              console.log("message", "User Not found.");
              return done(null, false);
            }
            if (!isValidPassword(user, password)) {
              console.log("Invalid Password");
              console.log("message", "Invalid Password");
              return done(null, false);
            }
            return done(null, user);
          });
        }
      )
    );

    const isValidPassword = (user, password) => {
      return bCrypt.compareSync(password, user.password);
    };

    passport.use(
      "register",
      new LocalStrategy(
        {
          passReqToCallback: true,
        },
        (req, username, password, done) => {
          const findOrCreateUser = () => {
            User.findOne({ username: username }, (err, user) => {
              if (err) {
                console.log("Error in SignUp: " + err);
                return done(err);
              }
              if (user) {
                console.log("User already exists");
                console.log("message", "User Already Exists");
                return done(null, false);
              } else {
                const newUser = new User();
                newUser.username = username;
                newUser.password = createHash(password);
                newUser.save((err) => {
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
          process.nextTick(findOrCreateUser);
        }
      )
    );

    const createHash = (password) => {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });
  }

  middlewares() {
    this.app.use(cookieParser());
    // this.app.use(express.static(__dirname + "/public"));
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

    // Ruta RAIZ
    this.app.get("/", async (req, res) => {
      this.app.use(express.static(__dirname + "/public"));
      console.log("entra");
      const nombre = "Desafio 33";
      let productExist = true;
      let productos = await Producto.find();
      res.render("pages/index", { productos, productExist, nombre });
    });

    //Rutas Productos
    this.app.use("/api", require("./routes/productos.routes"));

    //Login
    this.app.get("/login", async (req, res) => {
      if (req.isAuthenticated()) {
        const nombre = req.user.username;
        try {
          const cant = req.query.cant;
          if (cant === "0") {
            let productExist = false;
            res.render("pages/index", { productExist, nombre });
          } else if (!cant) {
            let productExist = true;
            let productos = await Producto.find();
            res.render("pages/index", { productos, productExist, nombre });
          } else {
            let productExist = true;
            let productos = await Producto.find();
            res.render("pages/index", { productos, productExist, nombre });
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        res.sendFile(process.cwd() + "/public/login.html");
      }
    });

    this.app.post(
      "/login",
      passport.authenticate("login", { failureRedirect: "/faillogin" }),
      (req, res) => {
        let { nombre } = req.body;
        req.session.nombre = nombre;
        res.redirect("/login");
      }
    );

    this.app.get("/faillogin", (req, res) => {
      res.render("pages/login-error");
    });

    //REGISTER
    this.app.get("/register", (req, res) => {
      res.sendFile(process.cwd() + "/public/register.html");
    });

    this.app.post(
      "/register",
      passport.authenticate("register", { failureRedirect: "/failregister" }),
      (req, res) => {
        res.redirect("/login");
      }
    );

    this.app.get("/failregister", (req, res) => {
      res.render("pages/register-error");
    });

    //Logout
    this.app.get("/logout", (req, res) => {
      let nombre = req.user.username;
      if (nombre) {
        req.session.destroy((err) => {
          if (!err) res.render("pages/logout", { nombre });
          else res.redirect("/");
        });
      } else {
        res.redirect("/");
      }
    });
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
