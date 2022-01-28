const { responseSuccess, responseError } = require("../../network/response");
const { emailOrder } = require("../../configs/node-gmail");

const {
  findAllOrdersUser,
  findOneOrderUser,
  addOneOrder,
  updateOneOrder,
  deleteOneOrder,
} = require("./orders.store");

//Show all orders of a user
const allOrdersUser = async (req, res) => {
  try {
    const email = req.user.email;
    const orders = await findAllOrdersUser(email);
    if (orders !== null) {
      return responseSuccess(req, res, null, 200, orders);
    }
    return responseError(req, res, "Orders not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Shows an order from a user
const oneOrderUser = async (req, res) => {
  try {
    const email = req.user.email;
    const ido = req.params.id_order;
    const order = await findOneOrderUser(email, ido);
    if (order !== null) {
      return responseSuccess(req, res, null, 200, order);
    }
    return responseError(req, res, "Order Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to generate an order through a shopping cart
const addOrder = async (req, res) => {
  try {
    const email = req.user.email;
    const order = await addOneOrder(email);
    if (order !== null) {
      const { email, address, state } = order;
      emailOrder(email, address, state);
      return responseSuccess(req, res, null, 200, order);
    }
    return responseError(req, res, "Cart Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to modify the state of an order
const updateOrder = async (req, res) => {
  try {
    const email = req.user.email;
    const ido = req.params.id_order;
    const state = req.body.state;
    const updateOrder = await updateOneOrder(email, ido, state);
    if (updateOrder !== null) {
      return responseSuccess(req, res, null, 200, updateOrder);
    }
    return responseError(req, res, "Order Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to remove an order
const deleteOrder = async (req, res) => {
  try {
    const email = req.user.email;
    const ido = req.params.id_order;
    const deleteOrder = await deleteOneOrder(email, ido);
    if (deleteOrder !== null) {
      return responseSuccess(req, res, null, 200, null);
    }
    return responseError(req, res, "Order Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

module.exports = {
  allOrdersUser,
  oneOrderUser,
  addOrder,
  updateOrder,
  deleteOrder,
};
