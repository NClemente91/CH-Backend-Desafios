var express = require("express");
var Io = require("socket.io");
var Http = require("http");
var path = require("path");
var productos = require("./productos.json");
var messages = require("./messages.json");
var Server = /** @class */ (function () {
    function Server() {
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
    Server.prototype.middlewares = function () {
        this.app.use(express.static(__dirname + "/public"));
    };
    Server.prototype.routes = function () {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use("/api", require("./routes/productos.routes"));
    };
    Server.prototype.ejs = function () {
        //Establecemos el motor de plantilla que se utiliza
        this.app.set("view engine", "ejs");
        //Establecemos el directorio donde se encuentran los archivos de plantilla
        this.app.set("views", "./views");
    };
    Server.prototype.ws = function () {
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
    };
    Server.prototype.start = function () {
        var _this = this;
        this.http.listen(this.port, function () {
            try {
                console.log("Servidor conectado en puerto " + _this.port);
            }
            catch (error) {
                console.log("Error de conexión", error);
            }
        });
    };
    return Server;
}());
var server = new Server();
server.start();
