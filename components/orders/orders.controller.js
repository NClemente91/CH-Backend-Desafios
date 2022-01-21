const { responseSuccess, responseError } = require("../../network/response");
const { loggerInfo, loggerError } = require("../../configs/loggers");
const gmail = require("../../configs/email/gmail");
const whatsapp = require("../../configs/email/twilio");

const {
  findAllOrdersUser,
  findOneOrderUser,
  addOneOrder,
  updateOneOrder,
  deleteOneOrder,
} = require("./orders.store");

//PARA LISTAR TODOS LAS ORDENES DEL USUARIO
const allOrdersUser = async (req, res) => {
  const email = req.user.email;
  try {
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
    res.send("Add order");
    // const email = req.user.email;
    // const order = await addOneProductCart(email, id);
    // if (addProduct !== null) {
    //   return responseSuccess(req, res, null, 200, addProduct);
    // } else {
    //   return responseError(req, res, "Product Not Found", 404);
    // }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA MODIFICAR EL ESTADO DE UNA ORDEN
const updateOrder = async (req, res) => {
  try {
    res.send("Update order");
    // const email = req.user.email;
    // const idp = req.params.id_product;
    // const qty = req.body.quantity;
    // const addProduct = await updateOneProductCart(email, idp, qty);
    // if (addProduct !== null) {
    //   return responseSuccess(req, res, null, 200, addProduct);
    // } else {
    //   return responseError(req, res, "Product Not Found", 404);
    // }
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//PARA BORRAR UNA ORDEN
const deleteOrder = async (req, res) => {
  try {
    res.send("Delete order");
    // const email = req.user.email;
    // const idp = req.params.id_product;
    // const deleteProductIndex = await deleteOneProductCart(email, idp);
    // if (deleteProductIndex !== null) {
    //   return responseSuccess(req, res, null, 200, null);
    // } else {
    //   return responseError(req, res, "Product Not Found", 404);
    // }
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
