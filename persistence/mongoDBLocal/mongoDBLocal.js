const dbConnection = require("./configs/mongodb");
const Product = require("./models/products");
const Cart = require("./models/cart");

class MongoDBLocal {
  constructor() {
    this.dbConnection = dbConnection();
    this.Product = Product;
    this.Cart = Cart;
  }

  //--------------PRODUCTOS---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  async getAllProducts() {
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
  }

  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  async getOneProduct(idp) {
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
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL LISTADO
  async postOneProduct(prod) {
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
  }

  //METODO PARA ACTUALIZAR UN PRODUCTO POR SI ID
  async putOneProduct(idp, prod) {
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
  }

  //METODO PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
  async deleteOneProduct(idp) {
    try {
      const productDelete = await this.Product.deleteOne({ _id: idp });
      console.log(productDelete);
      if (productDelete.deletedCount === 1) {
        return this.Product.find();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //--------------CARRITO---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO (OK)
  async getAllProductsCart() {
    try {
      const cart = await this.Cart.find();
      if (!cart) {
        return null;
      } else {
        return cart[0].producto;
      }
    } catch (error) {
      return null;
    }
  }

  //METODO PARA LISTAR UN PRODUCTO GUARDADO EN EL CARRITO POR SU ID
  async getOneProductCart(idp) {
    try {
      const cart = await this.Cart.find();
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
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL CARRITO POR SU ID
  async postOneProductCart(idp) {
    try {
      const addProduct = await this.Product.findById(idp);
      const cart = await this.Cart.find();
      const cartId = cart[0]._id;
      if (addProduct && cart.length === 0) {
        const newCart = {
          timestamp: Date.now(),
          producto: [addProduct],
        };
        const addProductCart = this.Cart.create(newCart);
        return addProductCart;
      } else if (addProduct && cart.length !== 0) {
        const cartProduct = cart[0].producto;
        cartProduct.push(addProduct);
        const updateProduct = await this.Cart.findOneAndUpdate(
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
  }

  //METODO PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
  async deleteOneProductCart(idp) {
    try {
      const deleteProduct = await this.Product.findById(idp);
      const cart = await this.Cart.find();
      const cartId = cart[0]._id;
      if ((deleteProduct && cart.length === 0) || !deleteProduct) {
        return null;
      } else {
        const cartProduct = cart[0].producto;
        const cartProductDelete = cartProduct.findIndex((p) => p._id == idp);
        if (cartProductDelete !== -1) {
          cartProduct.splice(cartProductDelete, 1);
          const updateProduct = await this.Cart.findOneAndUpdate(
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
  }
}

module.exports = MongoDBLocal;
