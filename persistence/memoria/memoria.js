let products = require("./products.json");
let cart = require("./cart.json");

class Memoria {
  constructor() {
    this.products = products;
    this.cart = cart;
  }

  //--------------PRODUCTOS---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  getAllProducts() {
    return this.products;
  }

  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  getOneProduct(idp) {
    let productIndex = this.products.findIndex((p) => p.id === Number(idp));
    if (productIndex !== -1) {
      return this.products[productIndex];
    } else {
      return null;
    }
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL LISTADO
  postOneProduct(prod) {
    const { nombre, descripcion, foto, precio, stock } = prod;
    if (nombre && descripcion && foto && precio && stock) {
      const newProduct = {
        id: this.products[this.products.length - 1].id + 1 || 1,
        timestamp: Date.now(),
        nombre,
        descripcion,
        codigo: Math.floor(Math.random() * (999 - 1)) + 1,
        foto,
        precio,
        stock,
      };
      this.products.push(newProduct);
      return newProduct;
    } else {
      return null;
    }
  }

  //METODO PARA ACTUALIZAR UN PRODUCTO POR SI ID
  putOneProduct(idp, prod) {
    const { foto, precio, stock } = prod;
    let updateProductindex = this.products.findIndex(
      (p) => p.id === Number(idp)
    );
    if (updateProductindex !== -1 && foto && precio && stock) {
      this.products[updateProductindex].foto = foto;
      this.products[updateProductindex].precio = precio;
      this.products[updateProductindex].stock = stock;
      return this.products[updateProductindex];
    } else {
      return null;
    }
  }

  //METODO PARA BORRAR UN PRODUCTO POR SI ID
  deleteOneProduct(idp) {
    const updateProductindex = this.products.findIndex(
      (p) => p.id === Number(idp)
    );
    if (updateProductindex !== -1) {
      this.products.splice(updateProductindex, 1);
      return this.products;
    } else {
      return null;
    }
  }

  //--------------CARRITO---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO
  getAllProductsCart() {
    return this.cart[0].producto;
  }

  //METODO PARA LISTAR UN PRODUCTO GUARDADO EN EL CARRITO POR SU ID
  getOneProductCart(idc) {
    let productIndex = this.cart[0].producto.findIndex(
      (p) => p.id === Number(idc)
    );
    if (productIndex !== -1) {
      return this.cart[0].producto[productIndex];
    } else {
      return null;
    }
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL CARRITO POR SU ID
  postOneProductCart(idp) {
    const addProductIndex = this.products.findIndex(
      (p) => p.id === Number(idp)
    );
    if (addProductIndex !== -1 && this.cart.length === 0) {
      const newCart = {
        id: 1,
        timestamp: Date.now(),
        producto: [this.products[addProductIndex]],
      };
      return newCart;
    } else if (addProductIndex !== -1 && this.cart.length !== 0) {
      this.cart[0].producto.push(this.products[addProductIndex]);
      return this.cart;
    } else {
      return null;
    }
  }

  //METODO PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
  deleteOneProductCart(idp) {
    const deleteProductIndex = this.cart[0].producto.findIndex(
      (p) => p.id === Number(idp)
    );
    if (deleteProductIndex !== -1) {
      this.cart[0].producto.splice(deleteProductIndex, 1);
      return this.cart;
    } else {
      return null;
    }
  }
}

module.exports = Memoria;
