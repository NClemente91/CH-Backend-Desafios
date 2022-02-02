const Io = require("socket.io");
const { loggerInfo, loggerError } = require("./loggers");

const { findAllProducts } = require("../components/products/products.store");
const { findAllOrdersUser } = require("../components/orders/orders.store");
const { findAllProductsCart } = require("../components/cart/cart.store");
const {
  findMessagesUser,
  addOneMessage,
} = require("../components/chat/chat.store");

const messageController = async (message, user) => {
  switch (message) {
    case "stock":
      let messageStock = [
        {
          email: user,
          typeUser: "system",
          message,
        },
      ];
      const productList = await findAllProducts();
      productList.map((product) => {
        messageStock[0].message = `${messageStock[0].message} --
        Nombre=${product.productName}, stock=${product.stock}`;
      });
      return messageStock;

    case "orden":
      let messageOrden = [
        {
          email: user,
          typeUser: "system",
          message,
        },
      ];
      const orderList = await findAllOrdersUser(user);
      if (orderList === null) {
        messageOrden[0].message = `No hemos encontrado ordenes con el email ${user}`;
        return messageOrden;
      }
      orderList.map((order) => {
        messageOrden[0].message = `Orden generada por ${user}. Cantidad de productos: ${order.products.length}. Estado: ${order.state}`;
      });
      return messageOrden;

    case "cart":
      let messageCart = [
        {
          email: user,
          typeUser: "system",
          message,
        },
      ];
      const cartProductList = await findAllProductsCart(user);
      if (cartProductList === null) {
        messageCart[0].message = `No hay productos cargados al carrito con el email ${user}`;
        return messageCart;
      }
      cartProductList.map((product) => {
        messageCart[0].message = `messageCart[0].message - Nombre=${product.productName}, precio unitario=${product.price}`;
      });
      return messageCart;

    default:
      let messageDefault = [];
      messageDefault = [
        {
          email: user,
          typeUser: "system",
          message:
            "Por favor, ingrese STOCK para ver el stock de nuestros productos, ingrese CART para ver los productos cargados y su precio o ingrese ORDEN si usted ya ha realizado orden y desea saber su estado",
        },
      ];
      return messageDefault;
  }
};

const initWsServer = (server) => {
  const io = Io(server, {
    transports: ["websocket"],
  });

  //Websocket connection
  io.on("connection", async (socket) => {
    try {
      loggerInfo.info(`New client connected! >> ${socket.id}`);

      const initialMessage = [
        {
          email: "Hola, bienvenido",
          typeUser: "system",
          message:
            "Por favor, ingrese STOCK para ver el stock de nuestros productos, ingrese CART para ver los productos cargados y su precio o ingrese ORDEN si usted ya ha realizado orden y desea saber su estado",
        },
      ];

      socket.emit("messages", initialMessage);

      socket.on("new-message", async (data) => {
        await addOneMessage(data.email, "user", `[Pregunta] ${data.message}`);
        const msjAdmin = data.message.toLowerCase();
        const respSystem = await messageController(msjAdmin, data.email);
        await addOneMessage(
          respSystem[0].email,
          respSystem[0].typeUser,
          `[Respuesta del sistema] ${respSystem[0].message}`
        );
        const allMessages = await findMessagesUser(data.email);
        io.sockets.emit("messages", allMessages);
      });
    } catch (error) {
      loggerInfo.info(`Error WS ${error}`);
      loggerError.error(`Error WS ${error}`);
    }
  });

  return io;
};

module.exports = initWsServer;
