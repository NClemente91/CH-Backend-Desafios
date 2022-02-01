const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./configs/config");
const passport = require("passport");
require("./configs/passport");
const router = require("./network/routes");
const dbConnection = require("./configs/mongodb");
const { loggerInfo, loggerError } = require("./configs/loggers");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const initWsServer = require("./configs/socket");

const app = express();

const server = require("http").Server(app);

app.use(cors());
dbConnection();

app.use(passport.initialize());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

initWsServer(server);

//Master
if (config.FORKORCLUSTER === "CLUSTER" && cluster.isMaster) {
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
  //Workers
  router(app);

  server.listen(config.PORT, () => {
    try {
      loggerInfo.info(`Servidor conectado en puerto ${config.PORT}`);
    } catch (error) {
      loggerInfo.info(`Error de conección ${error}`);
      loggerError.error(`Error de conección ${error}`);
    }
  });
}
