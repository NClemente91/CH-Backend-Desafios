const Io = require("socket.io");
const { loggerInfo, loggerError } = require("./loggers");

const { findAllProducts } = require("../components/products/products.store");
const { findAllOrdersUser } = require("../components/orders/orders.store");
const { findAllProductsCart } = require("../components/cart/cart.store");

const messageController = async (message, user) => {
  switch (message) {
    case "stock":
      let messageStock = [];
      const productList = await findAllProducts();
      productList.map((product) => {
        messageStock.push(
          `Nombre=${product.productName}, stock=${product.stock}`
        );
      });
      return messageStock;

    case "orden":
      let messageOrden = [];
      const orderList = await findAllOrdersUser(user);
      if (orderList === null) {
        messageOrden = [`No hemos encontrado ordenes con el email ${user}`];
        return messageOrden;
      }
      orderList.map((order) => {
        messageOrden.push(
          `Orden generada por ${user}. Cantidad de productos: ${order.products.length}. Estado: ${order.state}`
        );
      });
      return messageOrden;

    case "cart":
      let messageCart = [];
      const cartProductList = await findAllProductsCart(user);
      if (cartProductList === null) {
        messageCart = [
          `No hay productos cargados al carrito con el email ${user}`,
        ];
        return messageCart;
      }
      cartProductList.map((product) => {
        messageCart.push(
          `Nombre=${product.productName}, precio unitario=${product.price}`
        );
      });
      return messageCart;

    default:
      let messageDefault = [];
      messageDefault = [
        "Por favor, ingrese STOCK para ver el stock de nuestros productos.",
        "ingrese CART para ver los productos cargados y su precio",
        "ingrese ORDEN si usted ya ha realizado orden y desea saber su estado",
      ];
      return messageDefault;
  }
};

const initWsServer = (server) => {
  const io = Io(server);

  //Websocket connection
  io.on("connection", async (socket) => {
    try {
      loggerInfo.info(`New client connected! >> ${socket.id}`);

      socket.on("disconnect", () => {
        loggerInfo.info(`User disconnected! >> ${socket.id}`);
      });

      // socket.on("new message", async (msg) => {
      //   const msgAdmin = msg.toLowerCase();

      //   const message = await messageController(msgAdmin, socket.username);

      //   io.emit("send message", {
      //     message: message,
      //     user: socket.username,
      //   });
      // });

      // socket.on("new user", (usr) => {
      //   socket.username = usr;
      //   console.log("User connected - Email: " + socket.username);
      // });

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
