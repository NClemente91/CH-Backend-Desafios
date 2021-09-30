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
  getAllProducts() {
    try {
      const products = this.Product.find();
      if (!products) {
        return null;
      } else {
        return products;
      }
    } catch (error) {
      return error;
    }
  }

  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  getOneProduct(idp) {
    try {
      const product = this.Product.findById(idp);
      if (!product) {
        return null;
      } else {
        return product;
      }
    } catch (error) {
      return error;
    }
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL LISTADO
  postOneProduct(prod) {
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
        const addProduct = this.Product.create(newProduct);
        return addProduct;
      } else {
        return null;
      }
    } catch (error) {
      return error;
    }
  }

  //METODO PARA ACTUALIZAR UN PRODUCTO POR SI ID
  putOneProduct(idp, prod) {
    try {
      const product = this.Product.findOneAndUpdate(
        { _id: idp },
        { ...prod },
        { new: true }
      );
      if (!product) {
        return null;
      }
      return product;
    } catch (error) {
      return error;
    }
  }

  //METODO PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
  deleteOneProduct(idp) {
    try {
      const productDelete = this.Product.deleteOne({
        _id: req.params.id,
      });
      if (productDelete.n === 0) {
        return null;
      } else {
        return this.Product.find();
      }
    } catch (error) {
      return error;
    }
  }

  //--------------CARRITO---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO
  getAllProductsCart() {
    try {
      const cart = this.Cart.producto.find();
      if (!products) {
        return null;
      } else {
        return cart;
      }
    } catch (error) {
      return error;
    }
  }

  //METODO PARA LISTAR UN PRODUCTO GUARDADO EN EL CARRITO POR SU ID
  getOneProductCart(idc) {
    try {
      const cart = this.Cart.producto.findById(idp);
      if (!product) {
        return null;
      } else {
        return cart;
      }
    } catch (error) {
      return error;
    }
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL CARRITO POR SU ID
  async postOneProductCart(idp) {
    const addProduct = await this.Product.findById(idp);
    const cart = await this.Cart.find().producto;
    if (addProduct && cart.length === 0) {
      const addProductCart = this.Cart.create(newCart);
      return addProductCart;
    } else if (addProduct && cart.length !== 0) {
      const addProductCart = this.Cart.producto.create(addProduct);
      return addProductCart;
    } else {
      return null;
    }
  }

  //METODO PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
  deleteOneProductCart(idp) {
    // const deleteProductIndex = this.cart[0].producto.findIndex(
    //   (p) => p.id === Number(idp)
    // );
    // if (deleteProductIndex !== -1) {
    //   this.cart[0].producto.splice(deleteProductIndex, 1);
    //   const newJsonCart = JSON.stringify(this.cart);
    //   fs.writeFileSync(path.join(__dirname, "cart.json"), newJsonCart, "utf-8");
    //   return this.cart;
    // } else {
    //   return null;
    // }
  }
}

module.exports = MongoDBLocal;
