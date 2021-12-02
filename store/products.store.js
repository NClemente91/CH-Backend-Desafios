const Producto = require("../persistencia/productos");

const findAllProduct = async () => {
  return await Producto.find();
};

const findOneProductbyID = async (id) => {
  return await Producto.findById(id);
};

const createProduct = async (product) => {
  return await Producto.create(product);
};

const updateOneProduct = async (id, o1, o2) => {
  return await Producto.findOneAndUpdate(id, o1, o2);
};

const deleteOneProduct = async (id) => {
  return await Producto.deleteOne(id);
};

module.exports = {
  findAllProduct,
  findOneProductbyID,
  createProduct,
  updateOneProduct,
  deleteOneProduct,
};
