const productsRoutes = require("../components/products/products.routes");
const cartRoutes = require("../components/cart/cart.routes");
const usersRoutes = require("../components/users/users.routes");
const errorRoutes = require("../components/error/error.routes");

const passport = require("passport");

//MIDDLEWARES
const { authenticateToken } = require("../middleware/authorization");

const routes = (server) => {
  server.use("/products", authenticateToken, productsRoutes);
  server.use("/cart", authenticateToken, cartRoutes);
  server.use("/", usersRoutes);
  server.use("*", errorRoutes);
};

module.exports = routes;
