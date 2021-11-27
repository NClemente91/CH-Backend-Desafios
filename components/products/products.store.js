const Product = require("./products.model");

//METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
const getAllProducts = async () => {
  try {
    const products = await this.Product.find();
    if (!products) {
      return null;
    } else {
      return products;
    }
  } catch (error) {
    return null;
  }
};

//METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
const getOneProduct = async (idp) => {
  try {
    const product = await this.Product.findById(idp);
    if (!product) {
      return null;
    } else {
      return product;
    }
  } catch (error) {
    return null;
  }
};

//METODO PARA INCORPORAR UN PRODUCTO AL LISTADO
const postOneProduct = async (prod) => {
  try {
    const { nombre, descripcion, foto, precio, stock } = prod;
    if (nombre && descripcion && foto && precio && stock) {
      const newProduct = {
        nombre,
        timestamp: Date.now(),
        descripcion,
        codigo: Math.floor(Math.random() * (999 - 1)) + 1,
        foto,
        precio,
        stock,
      };
      const addProduct = await this.Product.create(newProduct);
      return addProduct;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

//METODO PARA ACTUALIZAR UN PRODUCTO POR SI ID
const putOneProduct = async (idp, prod) => {
  try {
    const product = await this.Product.findOneAndUpdate(
      { _id: idp },
      { ...prod },
      { new: true }
    );
    if (!product) {
      return null;
    }
    return product;
  } catch (error) {
    return null;
  }
};

//METODO PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
const deleteOneProduct = async (idp) => {
  try {
    const productDelete = await this.Product.deleteOne({ _id: idp });
    if (productDelete.deletedCount === 1) {
      return this.Product.find();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

module.exports = {
  getAllProducts,
  getOneProduct,
  postOneProduct,
  putOneProduct,
  deleteOneProduct,
};
