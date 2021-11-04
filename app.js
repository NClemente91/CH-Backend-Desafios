const express = require("express");
const Io = require("socket.io");
const Http = require("http");
const dbConnection = require("./configs/mongodb");
path = require("path");
const Mensaje = require("./models/mensajes");
const Producto = require("./models/productos");
const normalizr = require("normalizr");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { fork } = require("child_process");
const numCPUs = require("os").cpus().length;
const PORT = process.env.PORT || Number(process.argv[2]) || 5050;
const cluster = require("cluster");
const modoForkOrCluster = process.argv[5] || "FORK";

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
    this.port = PORT;

    this.session();

    this.middlewares();

    this.passportP();

    this.ejs();

    this.ws();

    this.routes();
  }

  passportP() {
    const FACEBOOK_CLIENT_ID = process.argv[3] || "267332308498460";
    const FACEBOOK_CLIENT_SECRET =
      process.argv[4] || "ee09b012c8fabf748774f19fc03";

    passport.use(
      new FacebookStrategy(
        {
          clientID: FACEBOOK_CLIENT_ID,
          clientSecret: FACEBOOK_CLIENT_SECRET,
          callbackURL: "/auth/facebook/callback",
          profileFields: ["id", "displayName", "photos", "emails"],
          scope: ["email"],
        },
        (accessToken, refreshToken, profile, done) => {
          let userProfile = profile;
          return done(null, userProfile);
        }
      )
    );

    passport.serializeUser(function (user, cb) {
      cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
      cb(null, obj);
    });
  }

  middlewares() {
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

    //Rutas Productos
    this.app.use("/api", require("./routes/productos.routes"));

    //Ruta Desafío 28
    this.app.get("/info", (req, res) => {
      const data = {
        port: 5050,
        facebookId: "Algo",
        SO: process.platform,
        NV: process.version,
        UM: `Memory: ${
          ((process.memoryUsage().rss / 1024 / 1024) * 100) / 100
        } MB`,
        PE: process.execPath,
        Pid: process.pid,
        CC: process.cwd(),
        NCPUs: numCPUs,
      };
      res.render("pages/info", { data });
    });

    this.app.get("/randoms", (req, res) => {
      const forked = fork("./childProcess/random.js");
      const cant = req.query.cant;
      if (!cant) {
        forked.send({ cant: 1e8 });
      } else {
        forked.send({ cant });
      }
      forked.on("message", (obj) => {
        res.send(obj);
      });
    });

    //Login
    this.app.get("/login", async (req, res) => {
      if (req.isAuthenticated()) {
        const nombre = req.user.displayName;
        const foto = req.user.photos[0].value;
        const email = req.user.emails[0].value;
        try {
          const cant = req.query.cant;
          if (cant === "0") {
            let productExist = false;
            res.render("pages/index", { productExist, nombre, foto, email });
          } else if (!cant) {
            let productExist = true;
            let productos = await Producto.find();
            res.render("pages/index", {
              productos,
              productExist,
              nombre,
              foto,
              email,
            });
          } else {
            let productExist = true;
            let productos = await Producto.find();
            res.render("pages/index", {
              productos,
              productExist,
              nombre,
              foto,
              email,
            });
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        res.sendFile(process.cwd() + "/public/login.html");
      }
    });

    this.app.get("/auth/facebook", passport.authenticate("facebook"));
    this.app.get(
      "/auth/facebook/callback",
      passport.authenticate("facebook", {
        successRedirect: "/home",
        failureRedirect: "/faillogin",
      })
    );

    this.app.get("/home", (req, res) => {
      res.redirect("/login");
    });

    this.app.get("/faillogin", (req, res) => {
      res.render("pages/login-error");
    });

    //Logout
    this.app.get("/logout", (req, res) => {
      let nombre = req.user.displayName;
      req.logout();
      res.render("pages/logout", { nombre });
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
        console.log(
          `Servidor express escuchando en el puerto ${this.port} - PID WORKER ${process.pid}`
        );
      } catch (error) {
        console.log("Error de conexión", error);
      }
    });
  }
}

//DESAFIO 29
// Entrada de prueba por consola
//node app.js "3300" "267332308498460" "ee09b012c8fabf748774f19fc03" "CLUSTER"
//tasklist /fi "imagename eq node.exe"    (en powershell)
//forever start app.js 8081 "267332308498460" "ee09b012c8fabf748774f19fc03" "CLUSTER"
//pm2 start app.js --name="Server1" --watch -- 8081
//pm2 start app.js --name="Server2" --watch -i max -- 8081

//DESAFIO 30
//MODO FORK
//pm2 start app.js --name="Server1" --watch -- "8081" "267332308498460" "ee09b012c8fabf748774f19fc03" "FORK"
//MODO CLUSTER
//pm2 start app.js --name="Server2" --watch -- "8082" "267332308498460" "ee09b012c8fabf748774f19fc03" "CLUSTER"
// ------------------ NGINX ----------------------
//http://nginx.org/en/docs/windows.html
//start nginx
//tasklist /fi "imagename eq nginx.exe"  (en powershell)
//nginx -s reload
//nginx -s quit

// MASTER
if (modoForkOrCluster === "CLUSTER" && cluster.isMaster) {
  console.log(numCPUs);
  console.log(`PID MASTER ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(
      "Worker",
      worker.process.pid,
      "died",
      new Date().toLocaleString()
    );
    cluster.fork();
  });
} else {
  //WORKERS
  const server = new Server();
  server.start();
}
