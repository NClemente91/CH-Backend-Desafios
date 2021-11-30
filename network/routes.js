const productsRoutes = require("../components/products/products.routes");
const cartRoutes = require("../components/cart/cart.routes");
const usersRoutes = require("../components/users/users.routes");
const errorRoutes = require("../components/error/error.routes");

const routes = (server) => {
  server.use("/productos", productsRoutes);
  server.use("/carrito", cartRoutes);
  server.use("/", usersRoutes);
  server.use("*", errorRoutes);
};

module.exports = routes;
