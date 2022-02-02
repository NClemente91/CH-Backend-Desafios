const { responseSuccess, responseError } = require("../../network/response");

const {
  findAllProducts,
  findOneProductbyID,
  findProductsbyCategory,
  createOneProduct,
  updateOneProductbyID,
  deleteOneProductbyID,
} = require("./products.store");

//Show all available products
const allProducts = async (req, res) => {
  try {
    const products = await findAllProducts();
    if (products !== null) {
      return responseSuccess(req, res, null, 200, products);
    }
    return responseError(req, res, "Products not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Show a product by its id
const oneProduct = async (req, res) => {
  try {
    const idp = req.params._id;
    const product = await findOneProductbyID(idp);
    if (product !== null) {
      return responseSuccess(req, res, null, 200, product);
    }
    return responseError(req, res, "Product not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Show the products of a category
const categoryProducts = async (req, res) => {
  try {
    const category = req.params._category;
    let products = await findProductsbyCategory(category);
    if (products !== null) {
      return responseSuccess(req, res, null, 200, products);
    }
    return responseError(req, res, "Products not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to add a product
const addProduct = async (req, res) => {
  try {
    const newProduct = await createOneProduct(req.body);
    return responseSuccess(req, res, null, 200, newProduct);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to update a product. Only photo, price or stock
const updateProduct = async (req, res) => {
  try {
    const idp = req.params._id;
    const productUpdate = await updateOneProductbyID(idp, req.body);
    if (productUpdate !== null) {
      return responseSuccess(req, res, null, 200, productUpdate);
    }
    return responseError(req, res, "Product not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

//Allows you to delete a product
const deleteProduct = async (req, res) => {
  try {
    const idp = req.params._id;
    const productDelete = await deleteOneProductbyID(idp);
    if (productDelete !== null) {
      return responseSuccess(req, res, null, 200, null);
    }
    return responseError(req, res, "Product not found", 404);
  } catch (error) {
    return responseError(req, res, error.message, 500);
  }
};

module.exports = {
  allProducts,
  oneProduct,
  categoryProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
