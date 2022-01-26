const Cart = require("./cart.model");

//METODO PARA LISTAR TODOS LOS CARRITOS GUARDADOS
const findAllCarts = async () => {
  try {
    const carts = await Cart.find();
    if (!carts) {
      return null;
    } else {
      return carts;
    }
  } catch (error) {
    throw new Error("Error al encontrar todos los carritos de compra");
  }
};

//METODO PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO
const findAllProductsCart = async (email) => {
  try {
    const cart = await Cart.find({ email }).populate({
      path: "products",
      populate: { path: "_id", select: "productName price" },
    });
    if (!cart) {
      return null;
    } else {
      return cart[0].products;
    }
  } catch (error) {
    throw new Error("Error al listar los productos de un carrito de compra");
  }
};

//METODO PARA LISTAR UN PRODUCTO GUARDADO EN EL CARRITO POR SU ID
const findOneProductCart = async (email, idp) => {
  try {
    const cart = await Cart.find({ email });
    if (cart[0].products.length !== 0) {
      const prodCart = cart[0].products.find((p) => p._id.toString() === idp);
      if (prodCart) {
        return prodCart;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error al listar un producto de un carrito de compra");
  }
};

//METODO PARA INCORPORAR UN PRODUCTO AL CARRITO POR SU ID
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
    throw new Error("Error al agregar un producto a un carrito de compra");
  }
};

//METODO PARA MODIFICAR UN PRODUCTO DEL CARRITO POR SU ID
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
      );
      return updateCart;
    }
    return null;
  } catch (error) {
    throw new Error("Error al actualizar el producto");
  }
};

//METODO PARA BORRAR UN PRODUCTO DEL CARRITO POR SU ID
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
      );
      return deleteProductCart;
    }
    return null;
  } catch (error) {
    throw new Error("Error al borrar un producto a un carrito de compra");
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
