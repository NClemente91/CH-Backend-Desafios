// const productsRoutes = require("../components/products/products.routes");
// const cartRoutes = require("../components/cart/cart.routes");
const usersRoutes = require("../components/users/users.routes");
const errorRoutes = require("../components/error/error.routes");

// const passport = require("passport");

const routes = (server) => {
  // server.use(
  //   "/productos",
  //   passport.authenticate("jwt", { session: false }),
  //   productsRoutes
  // );
  // server.use(
  //   "/carrito",
  //   passport.authenticate("jwt", { session: false }),
  //   cartRoutes
  // );
  server.use("/", usersRoutes);
  server.use("*", errorRoutes);
};

module.exports = routes;
