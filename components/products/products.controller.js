const { responseSuccess, responseError } = require("../../network/response");

const {
  findAllProducts,
  findOneProductbyID,
  findProductsbyCategory,
  createOneProduct,
  updateOneProductbyID,
  deleteOneProductbyID,
} = require("./products.store");

//PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
const allProducts = async (req, res) => {
  try {
    const products = await findAllProducts();
    return responseSuccess(req, res, null, 200, products);
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA LISTAR UN PRODUCTO POR SI ID
const oneProduct = async (req, res) => {
  try {
    const idp = req.params._id;
    let product = await findOneProductbyID(idp);
    if (product !== null) {
      return responseSuccess(req, res, null, 200, product);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA LISTAR TODOS LOS PRODUCTOS DE UNA CATEGORIA
const categoryProducts = async (req, res) => {
  try {
    const category = req.params._category;
    let products = await findProductsbyCategory(category);
    if (products !== null) {
      return responseSuccess(req, res, null, 200, products);
    } else {
      return responseError(req, res, "Products Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA INCORPORAR PRODUCTOS AL LISTADO
const addProduct = async (req, res) => {
  try {
    const newProduct = await createOneProduct(req.body);
    if (newProduct !== null) {
      return responseSuccess(req, res, null, 200, newProduct);
    } else {
      return responseError(req, res, "Data not found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA ACTUALIZAR UN PRODUCTO POR SI ID
//Suponemos que solo podemos modificar la foto, el precio y el stcok
const updateProduct = async (req, res) => {
  try {
    const idp = req.params._id;
    const productUpdate = await updateOneProductbyID(idp, req.body);
    if (productUpdate !== null) {
      return responseSuccess(req, res, null, 200, productUpdate);
    } else {
      return responseError(req, res, "Product or Data not found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA BORRAR UN PRODUCTO POR SI ID
const deleteProduct = async (req, res) => {
  try {
    const idp = req.params._id;
    const productDelete = await deleteOneProductbyID(idp);
    console.log(productDelete);
    if (productDelete !== null) {
      return responseSuccess(req, res, null, 200, productDelete);
    } else {
      return responseError(req, res, "Product not found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
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
