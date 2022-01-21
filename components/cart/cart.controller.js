const { responseSuccess, responseError } = require("../../network/response");
const { loggerInfo, loggerError } = require("../../configs/loggers");
const gmail = require("../../configs/email/gmail");
const whatsapp = require("../../configs/email/twilio");

const {
  findAllCarts,
  findAllProductsCart,
  findOneProductCart,
  addOneProductCart,
  updateOneProductCart,
  deleteOneProductCart,
} = require("./cart.store");

//PARA LISTAR TODOS LOS CARRITOS GUARDADOS (Solo con rol administrador)
const allCarts = async (req, res) => {
  try {
    const carts = await findAllCarts();
    return responseSuccess(req, res, null, 200, carts);
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO O UNO POR SI ID GUARDADO EN EL CARRITO
const listProductsCart = async (req, res) => {
  try {
    const email = req.user.email;
    const idc = req.params.id_cart;
    //SI NO SE PASA ID COMO PARÁMETRO, DEVUELVE TODOS
    if (!idc) {
      const allProducts = await findAllProductsCart(idc);
      if (allProducts !== null) {
        return responseSuccess(req, res, null, 200, allProducts);
      } else {
        return responseError(req, res, "Products Not Found", 404);
      }
      // const asunto = `Nuevo pedido de`;
      // const mensaje = `Productos comprados`;
      // const adjunto = ``;
      // const to = process.env.EMAIL_ADMIN;
      // const numero = `458565456`; //MODIFICAR MAS ADELANTE
      // gmail.enviarMail(asunto, mensaje, adjunto, to, (err, info) => {
      //   if (err) {
      //     loggerInfo.info(`Error en nodemailer-gmail ${err}`);
      //     loggerError.error(`Error en nodemailer-gmail ${err}`);
      //   } else {
      //     loggerInfo.info(`Email enviado con nodemailer-gmail ${info}`);
      //   }
      // });
      // whatsapp.enviarSMS(mensaje, numero, (err, info) => {
      //   if (err) {
      //     loggerInfo.info(`Error en twilio-Whatsapp ${err}`);
      //     loggerError.error(`Error en twilio-Whatsapp ${err}`);
      //   } else {
      //     loggerInfo.info(`Email enviado con twilio-Whatsapp ${info}`);
      //   }
      // });
    }
    //SI SE PASA ID COMO PARÁMETRO
    let product = await findOneProductCart(email, idc);
    if (product !== null) {
      return responseSuccess(req, res, null, 200, product);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA INCORPORAR PRODUCTOS AL CARRITO POR SU ID
const addProductCart = async (req, res) => {
  try {
    const email = req.user.email;
    const idp = req.params.id_product;
    const qty = req.body.quantity;
    const address = req.body.address;
    const addProduct = await addOneProductCart(email, idp, qty, address);
    if (addProduct !== null) {
      return responseSuccess(req, res, null, 200, addProduct);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA MODIFICAR PRODUCTOS DEL CARRITO POR SU ID
const updateProductCart = async (req, res) => {
  try {
    const email = req.user.email;
    const idp = req.params.id_product;
    const qty = req.body.quantity;
    const addProduct = await updateOneProductCart(email, idp, qty);
    if (addProduct !== null) {
      return responseSuccess(req, res, null, 200, addProduct);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
const deleteProductCart = async (req, res) => {
  try {
    const email = req.user.email;
    const idp = req.params.id_product;
    const deleteProductIndex = await deleteOneProductCart(email, idp);
    if (deleteProductIndex !== null) {
      return responseSuccess(req, res, null, 200, null);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

module.exports = {
  allCarts,
  listProductsCart,
  addProductCart,
  updateProductCart,
  deleteProductCart,
};
