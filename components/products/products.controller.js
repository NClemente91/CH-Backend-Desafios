const { responseSuccess, responseError } = require("../../network/response");

const {
  getAllProducts,
  getOneProduct,
  postOneProduct,
  putOneProduct,
  deleteOneProduct,
} = require("./products.store");

//PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES O UNO POR SI ID
const getProducts = async (req, res) => {
  try {
    const idp = req.params.id;

    //SI NO SE PASA ID COMO PARÁMETRO, DEVUELVE TODOS
    if (!idp) {
      const allProducts = await getAllProducts();
      return responseSuccess(req, res, null, 200, allProducts);
    }

    //SI SE PASA ID COMO PARÁMETRO
    let product = await getOneProduct(idp);
    if (product !== null) {
      return responseSuccess(req, res, null, 200, product);
    } else {
      return responseError(req, res, "Product Not Found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA INCORPORAR PRODUCTOS AL LISTADO
const postProducts = async (req, res) => {
  try {
    const newProduct = await postOneProduct(req.body);
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
const putProducts = async (req, res) => {
  try {
    const idp = req.params.id;
    const productUpdate = await putOneProduct(idp, req.body);
    if (productUpdate !== null) {
      return responseSuccess(req, res, null, 200, productUpdate);
    } else {
      return responseError(req, res, "Product or Data not found", 404);
    }
  } catch (error) {
    return responseError(req, res, "Internal Server Error", 500);
  }
};

//PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
const deleteProducts = async (req, res) => {
  try {
    const productDelete = await deleteOneProduct(req.params.id);
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
  getProducts,
  postProducts,
  putProducts,
  deleteProducts,
};
