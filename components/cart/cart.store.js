const Cart = require("./cart.model");
const Product = require("../products/products.model");

//METODO PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO (OK)
const getAllProductsCart = async () => {
  try {
    const cart = await Cart.find();
    if (!cart) {
      return null;
    } else {
      return cart[0].producto;
    }
  } catch (error) {
    return null;
  }
};

//METODO PARA LISTAR UN PRODUCTO GUARDADO EN EL CARRITO POR SU ID
const getOneProductCart = async (idp) => {
  try {
    const cart = await Cart.find();
    if (cart[0].producto.length !== 0) {
      const prodCart = cart[0].producto.find((p) => p._id == idp);
      if (prodCart) {
        return prodCart;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

//METODO PARA INCORPORAR UN PRODUCTO AL CARRITO POR SU ID
const postOneProductCart = async (idp) => {
  try {
    const addProduct = await Product.findById(idp);
    const cart = await Cart.find();
    const cartId = cart[0]._id;
    if (addProduct && cart.length === 0) {
      const newCart = {
        timestamp: Date.now(),
        producto: [addProduct],
      };
      const addProductCart = Cart.create(newCart);
      return addProductCart;
    } else if (addProduct && cart.length !== 0) {
      const cartProduct = cart[0].producto;
      cartProduct.push(addProduct);
      const updateProduct = await Cart.findOneAndUpdate(
        { _id: cartId },
        { producto: cartProduct },
        { new: true }
      );
      return updateProduct;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

//METODO PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
const deleteOneProductCart = async (idp) => {
  try {
    const deleteProduct = await Product.findById(idp);
    const cart = await Cart.find();
    const cartId = cart[0]._id;
    if ((deleteProduct && cart.length === 0) || !deleteProduct) {
      return null;
    } else {
      const cartProduct = cart[0].producto;
      const cartProductDelete = cartProduct.findIndex((p) => p._id == idp);
      if (cartProductDelete !== -1) {
        cartProduct.splice(cartProductDelete, 1);
        const updateProduct = await Cart.findOneAndUpdate(
          { _id: cartId },
          { producto: cartProduct },
          { new: true }
        );
        return updateProduct;
      } else {
        return null;
      }
    }
  } catch (error) {
    return null;
  }
};

module.exports = {
  getAllProductsCart,
  getOneProductCart,
  postOneProductCart,
  deleteOneProductCart,
};
