const pers = require("../persistencia/factory");

const findAllProduct = async () => {
  return await pers.getAllProducts();
};

const findOneProductbyID = async (id) => {
  return await pers.getOneProduct(id);
};

const createProduct = async (product) => {
  return await pers.postOneProduct(product);
};

const updateOneProduct = async (id, prod) => {
  return await pers.putOneProduct(id, prod);
};

const deleteOneProduct = async (id) => {
  return await pers.deleteOneProduct(id);
};

module.exports = {
  findAllProduct,
  findOneProductbyID,
  createProduct,
  updateOneProduct,
  deleteOneProduct,
};
