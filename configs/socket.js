const Io = require("socket.io");
const { loggerInfo, loggerError } = require("./loggers");
// const Chat = require("../components/chat/chat.model");

const initWsServer = (server) => {
  const io = Io(server);

  //Websocket connection
  io.on("connection", async (socket) => {
    loggerInfo.info(`New client connected! >> ${socket.id}`);

    try {
      //   socket.on("disconnect", () => {
      //     loggerInfo.info(`User disconnected - Email:${socket.username}`);
      //   });
      //   socket.on("new user", (user) => {
      //     socket.username = user;
      //     loggerInfo.info(`User connected - Email:${socket.username}`);
      //   });
      //   const productos = await Producto.find();
      //   socket.emit("productosExistentes", {
      //     value: productos,
      //   });
      //   socket.on("notificacion", async (data) => {
      //     if (data) {
      //       const newProductos = await Producto.find();
      //       io.sockets.emit("productosExistentes", {
      //         value: newProductos,
      //       });
      //     }
      //   });
      //   const messages = await Mensaje.find();
      //   socket.emit("messages", messages);
      //   socket.on("new-message", async (data) => {
      //     await Mensaje.create(data);
      //     const newMessages = await Mensaje.find();
      //     io.sockets.emit("messages", newMessages);
      //   });
    } catch (error) {
      loggerInfo.info(`Error WS ${error}`);
      loggerError.error(`Error WS ${error}`);
    }
  });

  return io;
};

module.exports = initWsServer;
