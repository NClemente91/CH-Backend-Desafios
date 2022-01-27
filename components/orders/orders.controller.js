const { responseSuccess, responseError } = require("../../network/response");
const { emailOrder } = require("../../configs/node-gmail");

const {
  findAllOrdersUser,
  findOneOrderUser,
  addOneOrder,
  updateOneOrder,
  deleteOneOrder,
} = require("./orders.store");

//PARA LISTAR TODOS LAS ORDENES DEL USUARIO
const allOrdersUser = async (req, res) => {
  try {
    const email = req.user.email;
    const orders = await findAllOrdersUser(email);
    return responseSuccess(req, res, null, 200, orders);
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA LISTAR UNA ORDEN DE UN USUARIO
const oneOrderUser = async (req, res) => {
  try {
    const email = req.user.email;
    const ido = req.params.id_order;
    const order = await findOneOrderUser(email, ido);
    if (order !== null) {
      return responseSuccess(req, res, null, 200, order);
    } else {
      return responseError(req, res, "Order Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA INGRESAR UNA ORDEN
const addOrder = async (req, res) => {
  try {
    const email = req.user.email;
    const order = await addOneOrder(email);
    if (order !== null) {
      const { email, address, state } = order;
      emailOrder(email, address, state);
      return responseSuccess(req, res, null, 200, order);
    } else {
      return responseError(req, res, "Cart Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA MODIFICAR EL ESTADO DE UNA ORDEN
const updateOrder = async (req, res) => {
  try {
    const email = req.user.email;
    const ido = req.params.id_order;
    const state = req.body.state;
    const updateOrder = await updateOneOrder(email, ido, state);
    if (updateOrder !== null) {
      return responseSuccess(req, res, null, 200, updateOrder);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//PARA BORRAR UNA ORDEN
const deleteOrder = async (req, res) => {
  try {
    const email = req.user.email;
    const ido = req.params.id_order;
    const deleteOrder = await deleteOneOrder(email, ido);
    if (deleteOrder !== null) {
      return responseSuccess(req, res, null, 200, null);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

module.exports = {
  allOrdersUser,
  oneOrderUser,
  addOrder,
  updateOrder,
  deleteOrder,
};
