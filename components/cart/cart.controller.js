const { responseSuccess, responseError } = require("../../network/response");

const {
  getAllProductsCart,
  getOneProductCart,
  postOneProductCart,
  deleteOneProductCart,
} = require("./cart.store");

//PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO O UNO POR SI ID GUARDADO EN EL CARRITO
const getProductsCart = async (req, res) => {
  try {
    const idc = req.params.id;

    //SI NO SE PASA ID COMO PARÁMETRO, DEVUELVE TODOS
    if (!idc) {
      const allProducts = await getAllProductsCart();
      return responseSuccess(req, res, null, 200, allProducts);
    }

    //SI SE PASA ID COMO PARÁMETRO
    let product = await getOneProductCart(idc);
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
const postProductsCart = async (req, res) => {
  try {
    const idp = req.params.id_producto;
    const addProduct = await postOneProductCart(idp);

    if (addProduct !== null) {
      return responseSuccess(req, res, null, 200, addProduct);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
const deleteProductsCart = async (req, res) => {
  try {
    const idp = req.params.id_producto;
    const deleteProductIndex = await deleteOneProductCart(idp);

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
  getProductsCart,
  postProductsCart,
  deleteProductsCart,
};
