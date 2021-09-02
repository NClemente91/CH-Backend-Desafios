"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require("express");
var Io = require("socket.io");
var Http = require("http");
var path = require("path");
var productos = require("./productos.json");
var messages = require("./messages.json");

var Server = function () {
  function Server() {
    _classCallCheck(this, Server);

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

  _createClass(Server, [{
    key: "middlewares",
    value: function middlewares() {
      this.app.use(express.static(__dirname + "/public"));
    }
  }, {
    key: "routes",
    value: function routes() {
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use("/api", require("./routes/productos.routes"));
    }
  }, {
    key: "ejs",
    value: function ejs() {
      //Establecemos el motor de plantilla que se utiliza
      this.app.set("view engine", "ejs");

      //Establecemos el directorio donde se encuentran los archivos de plantilla
      this.app.set("views", "./views");
    }
  }, {
    key: "ws",
    value: function ws() {
      var _this = this;

      this.io.on("connection", function (socket) {
        console.log("Cliente conectado: " + socket.id);

        socket.emit("productosExistentes", { value: productos });

        socket.on("notificacion", function (data) {
          if (data) {
            _this.io.sockets.emit("productosExistentes", { value: productos });
          }
        });

        socket.emit("messages", messages);

        socket.on("new-message", function (data) {
          messages.push(data);
          _this.io.sockets.emit("messages", messages);
        });
      });
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      this.http.listen(this.port, function () {
        try {
          console.log("Servidor conectado en puerto " + _this2.port);
        } catch (error) {
          console.log("Error de conexión", error);
        }
      });
    }
  }]);

  return Server;
}();

var server = new Server();

server.start();
