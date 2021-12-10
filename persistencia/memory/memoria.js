let products = require("./products.json");
let messages = require("./messages.json");
let users = require("./users.json");

class Memoria {
  constructor() {
    this.products = products;
    this.messages = messages;
    this.users = users;
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
    const { title, price, thumbnail } = prod;
    if (title && price && thumbnail) {
      const newProduct = {
        id: this.products[this.products.length - 1].id + 1 || 1,
        title,
        price,
        thumbnail,
      };
      this.products.push(newProduct);
      return newProduct;
    } else {
      return null;
    }
  }

  //METODO PARA ACTUALIZAR UN PRODUCTO POR SI ID
  putOneProduct(idp, prod) {
    const { title, price, thumbnail } = prod;
    let updateProductindex = this.products.findIndex(
      (p) => p.id === Number(idp)
    );
    if (updateProductindex !== -1 && title && price && thumbnail) {
      this.products[updateProductindex].title = title;
      this.products[updateProductindex].price = price;
      this.products[updateProductindex].thumbnail = thumbnail;
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

  //--------------MENSAJES---------------//
  //METODO PARA LISTAR TODOS LOS MENSAJES DISPONIBLES
  getAllMessages() {
    return this.messages;
  }

  //METODO PARA INCORPORAR UN MENSAJE AL LISTADO
  postMessage(msj) {
    const { author, hora, text } = msj;
    if (author && hora && text) {
      const newMessage = {
        id: this.messages[this.messages.length - 1].id + 1 || 1,
        author,
        hora,
        text,
      };
      this.messages.push(newMessage);
      return newMessage;
    } else {
      return null;
    }
  }
}

module.exports = Memoria;
