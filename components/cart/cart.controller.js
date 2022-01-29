const { responseSuccess, responseError } = require("../../network/response");

const {
  findAllCarts,
  findAllProductsCart,
  findOneProductCart,
  addOneProductCart,
  updateOneProductCart,
  deleteOneProductCart,
} = require("./cart.store");

const { findOneProductbyID } = require("../products/products.store");

//Show all available carts (Only available for administrator)
const allCarts = async (req, res) => {
  try {
    const carts = await findAllCarts();
    if (carts !== null) {
      return responseSuccess(req, res, null, 200, carts);
    }
    return responseError(req, res, "Carts Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Show an existing product in a specific cart
const listProductCart = async (req, res) => {
  try {
    const email = req.user.email;
    const idp = req.params.id_productCart;
    let product = await findOneProductCart(email, idp);
    if (product !== null) {
      return responseSuccess(req, res, null, 200, product);
    }
    return responseError(req, res, "Product Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Show all existing products in a specific cart
const listProductsCart = async (req, res) => {
  try {
    const email = req.user.email;
    const allProducts = await findAllProductsCart(email);
    if (allProducts !== null) {
      return responseSuccess(req, res, null, 200, allProducts);
    }
    return responseError(req, res, "Products Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to add a product to a specific cart
const addProductCart = async (req, res) => {
  try {
    const email = req.user.email;
    const idp = req.params.id_product;
    const qty = req.body.quantity;
    const address = req.user.address;
    const verifyExistProduct = await findOneProductbyID(idp);
    if (verifyExistProduct !== null) {
      const addProduct = await addOneProductCart(email, idp, qty, address);
      return responseSuccess(req, res, null, 200, addProduct);
    }
    return responseError(req, res, "Product Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to update the quantity of a product in a specific cart
const updateProductCart = async (req, res) => {
  try {
    const email = req.user.email;
    const idp = req.params.id_product;
    const qty = req.body.quantity;
    const addProduct = await updateOneProductCart(email, idp, qty);
    if (addProduct !== null) {
      return responseSuccess(req, res, null, 200, addProduct);
    }
    return responseError(req, res, "Product Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to delete a product from a specific cart
const deleteProductCart = async (req, res) => {
  try {
    const email = req.user.email;
    const idp = req.params.id_product;
    const deleteProductIndex = await deleteOneProductCart(email, idp);
    if (deleteProductIndex !== null) {
      return responseSuccess(req, res, null, 200, deleteProductIndex);
    }
    return responseError(req, res, "Product Not Found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

module.exports = {
  allCarts,
  listProductCart,
  listProductsCart,
  addProductCart,
  updateProductCart,
  deleteProductCart,
};
