const Product = require("./products.model");

//METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
const findAllProducts = async () => {
  try {
    const products = await Product.find();
    if (!products) {
      return null;
    } else {
      return products;
    }
  } catch (error) {
    throw new Error("Error al encontrar todos los productos disponibles");
  }
};

//METODO PARA LISTAR UN PRODUCTO POR SU ID
const findOneProductbyID = async (idp) => {
  try {
    const product = await Product.findById(idp);
    if (!product) {
      return null;
    } else {
      return product;
    }
  } catch (error) {
    throw new Error("Error al encontrar un producto por id");
  }
};

//METODO PARA LISTAR PRODUCTOS QUE COINCIDAN EN LA CATEGORÍA
const findProductsbyCategory = async (cat) => {
  try {
    if (cat !== "frutas" && cat !== "verduras") {
      return null;
    } else {
      const products = await Product.find();
      if (!products) {
        return null;
      }
      catProducts = products.filter((p) => p.category === cat);
      return catProducts;
    }
  } catch (error) {
    throw new Error("Error al encontrar un producto por categoria");
  }
};

//METODO PARA INCORPORAR UN PRODUCTO AL LISTADO
const createOneProduct = async (prod) => {
  try {
    const { productName, description, photo, price, stock, category } = prod;
    if (productName && description && photo && price && stock && category) {
      const newProduct = {
        productName,
        description,
        code: Math.floor(Math.random() * (999 - 1)) + 1,
        photo,
        price,
        stock,
        category,
      };
      const addProduct = await Product.create(newProduct);
      return addProduct;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error al incorporar un producto");
  }
};

//METODO PARA ACTUALIZAR UN PRODUCTO POR SI ID
const updateOneProductbyID = async (idp, prod) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: idp },
      { ...prod },
      { new: true }
    );
    if (!product) {
      return null;
    }
    return product;
  } catch (error) {
    throw new Error("Error al actualizar un producto");
  }
};

//METODO PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
const deleteOneProductbyID = async (idp) => {
  try {
    const productDelete = await Product.deleteOne({ _id: idp });
    if (productDelete.deletedCount === 1) {
      return this.Product.find();
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error al borrar un producto");
  }
};

module.exports = {
  findAllProducts,
  findOneProductbyID,
  findProductsbyCategory,
  createOneProduct,
  updateOneProductbyID,
  deleteOneProductbyID,
};
