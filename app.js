const express = require("express");
const cors = require("cors");
require("dotenv").config();

const router = require("./network/routes");
const dbConnection = require("./configs/mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const { loggerInfo, loggerWarn, loggerError } = require("./configs/loggers");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const modoForkOrCluster = process.argv[2] || "FORK";

const app = express();

require("./configs/passport");

app.use(cors());
dbConnection();

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      autoReconnect: true,
      ttl: 600,
    }),
    secret: "claveProyectoFinal2021",
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
      maxAge: 3600,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", "./views");

//MASTER
if (modoForkOrCluster === "CLUSTER" && cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    loggerInfo.info(
      "Worker",
      worker.process.pid,
      "died",
      new Date().toLocaleString()
    );
    cluster.fork();
  });
} else {
  //WORKERS
  router(app);

  const port = process.env.PORT;

  app.listen(port, () => {
    try {
      loggerInfo.info(`Servidor conectado en puerto ${port}`);
    } catch (error) {
      loggerInfo.info(`Error de conección ${error}`);
      loggerError.error(`Error de conección ${error}`);
    }
  });
}
