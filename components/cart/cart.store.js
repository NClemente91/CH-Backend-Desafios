const Cart = require("./cart.model");

//Function that returns all shopping carts in MongoDB
const findAllCarts = async () => {
  try {
    const carts = await Cart.find().populate({
      path: "products",
      populate: { path: "_id", select: "productName price" },
    });
    if (carts.length === 0) {
      return null;
    } else {
      return carts;
    }
  } catch (error) {
    throw new Error("Error searching all shopping carts");
  }
};

//Function that returns all the products of a shopping cart in MongoDB
const findAllProductsCart = async (email) => {
  try {
    const cart = await Cart.find({ email }).populate({
      path: "products",
      populate: { path: "_id", select: "productName price" },
    });
    if (cart.length === 0) {
      return null;
    } else {
      return cart[0].products;
    }
  } catch (error) {
    throw new Error("Error searching for all products in a shopping cart");
  }
};

//Function that returns a product by its id from a shopping cart in MongoDB
const findOneProductCart = async (email, idp) => {
  try {
    const cart = await Cart.find({ email }).populate({
      path: "products",
      populate: { path: "_id", select: "productName price" },
    });
    if (cart.length !== 0) {
      const prodCart = cart[0].products.find(
        (p) => p._id._id.toString() === idp
      );
      if (prodCart) {
        return prodCart;
      }
    }
    return null;
  } catch (error) {
    throw new Error(
      "Error searching for a product by its id in a shopping cart"
    );
  }
};

//Function to add a product to a shopping cart in MongoDB
const addOneProductCart = async (email, idp, qty, address) => {
  try {
    const cart = await Cart.find({ email });
    if (cart.length === 0) {
      const newCart = {
        email,
        products: [{ _id: idp, quantity: qty }],
        address,
      };
      const addProductCart = Cart.create(newCart);
      return addProductCart;
    } else {
      const cartId = cart[0]._id;
      const indexAddProduct = cart[0].products.findIndex(
        (p) => p._id.toString() === idp
      );
      if (indexAddProduct !== -1) {
        cart[0].products[indexAddProduct].quantity += qty;
        const addProductCart = await Cart.findOneAndUpdate(
          { _id: cartId },
          { products: cart[0].products },
          { new: true }
        ).populate({
          path: "products",
          populate: { path: "_id", select: "productName price" },
        });
        return addProductCart;
      }
      const cartProducts = [...cart[0].products, { _id: idp, quantity: qty }];
      const addNewProductCart = await Cart.findOneAndUpdate(
        { _id: cartId },
        { products: cartProducts },
        { new: true }
      ).populate({
        path: "products",
        populate: { path: "_id", select: "productName price" },
      });
      return addNewProductCart;
    }
  } catch (error) {
    throw new Error("Error adding a product to a shopping cart");
  }
};

//Function to update a product to a shopping cart in MongoDB
const updateOneProductCart = async (email, idp, qty) => {
  try {
    const cart = await Cart.find({ email });
    const cartId = cart[0]._id;
    const indexUpdateQtyProduct = cart[0].products.findIndex(
      (p) => p._id.toString() === idp
    );
    if (indexUpdateQtyProduct !== -1) {
      cart[0].products[indexUpdateQtyProduct].quantity = qty;
      const updateCart = await Cart.findOneAndUpdate(
        { _id: cartId },
        { products: cart[0].products },
        { new: true }
      ).populate({
        path: "products",
        populate: { path: "_id", select: "productName price" },
      });
      return updateCart;
    }
    return null;
  } catch (error) {
    throw new Error("Error updating a product to a shopping cart");
  }
};

//Function to remove a product to a shopping cart in MongoDB
const deleteOneProductCart = async (email, idp) => {
  try {
    const cart = await Cart.find({ email });
    const cartId = cart[0]._id;
    const indexDeleteProduct = cart[0].products.findIndex(
      (p) => p._id.toString() === idp
    );
    if (indexDeleteProduct !== -1) {
      cart[0].products.splice(indexDeleteProduct, 1);
      const deleteProductCart = await Cart.findOneAndUpdate(
        { _id: cartId },
        { products: cart[0].products },
        { new: true }
      ).populate({
        path: "products",
        populate: { path: "_id", select: "productName price" },
      });
      return deleteProductCart;
    }
    return null;
  } catch (error) {
    throw new Error("Error removing a product to a shopping cart");
  }
};

module.exports = {
  findAllCarts,
  findAllProductsCart,
  findOneProductCart,
  addOneProductCart,
  updateOneProductCart,
  deleteOneProductCart,
};
