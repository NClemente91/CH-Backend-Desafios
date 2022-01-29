const Product = require("./products.model");

//Function that returns the available products in MongoDB
const findAllProducts = async () => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return null;
    }
    return products;
  } catch (error) {
    throw new Error("Error searching all available products");
  }
};

//Function that returns a product by its id in MongoDB
const findOneProductbyID = async (idp) => {
  try {
    const product = await Product.findById(idp);
    if (!product) {
      return null;
    }
    return product;
  } catch (error) {
    throw new Error("Error searching for a product by id");
  }
};

//Function that returns the products that match in a category in MongoDB
const findProductsbyCategory = async (cat) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return null;
    }
    catProducts = products.filter((p) => p.category === cat);
    return catProducts;
  } catch (error) {
    throw new Error("Error searching products by category");
  }
};

//Function to add a product to MongoDB
const createOneProduct = async (prod) => {
  try {
    const newProduct = {
      ...prod,
      code: Math.floor(Math.random() * (999 - 1)) + 1,
    };
    const addProduct = await Product.create(newProduct);
    return addProduct;
  } catch (error) {
    throw new Error("Error adding a product");
  }
};

//Function to update a product by its id in MongoDB
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
    throw new Error("Error updating a product");
  }
};

//Function to remove a product by its id in MongoDB
const deleteOneProductbyID = async (idp) => {
  try {
    const productDelete = await Product.deleteOne({ _id: idp });
    if (productDelete.deletedCount === 1) {
      return;
    }
    return null;
  } catch (error) {
    throw new Error("Error removing a product");
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
