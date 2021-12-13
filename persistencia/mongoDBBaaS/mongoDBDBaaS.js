const dbConnection = require("./configs/mongodb");
const Product = require("../mongoDBBaaS/models/productos");
const Message = require("../mongoDBBaaS/models/mensajes");
const User = require("../mongoDBBaaS/models/users");

class MongoDBDBaaS {
  constructor() {
    this.dbConnection = dbConnection();
    this.Product = Product;
    this.Message = Message;
    this.User = User;
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
      const addProduct = await this.Product.create(prod);
      return addProduct;
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
      if (productDelete.deletedCount === 1) {
        return this.Product.find();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //--------------MENSAJES---------------//
  //METODO PARA LISTAR TODOS LOS MENSAJES
  async getAllMessages() {
    try {
      const messages = await this.Message.find();
      if (!messages) {
        return null;
      } else {
        return messages;
      }
    } catch (error) {
      return null;
    }
  }

  //METODO PARA INCORPORAR UN MENSAJE AL LISTADO
  async postMessage(msj) {
    try {
      const addMessage = await this.Message.create(msj);
      return addMessage;
    } catch (error) {
      return null;
    }
  }
}

module.exports = MongoDBDBaaS;
