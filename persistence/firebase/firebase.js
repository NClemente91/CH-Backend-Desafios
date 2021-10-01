const admin = require("firebase-admin");
const serviceAccount = require("./backendch-firebase-adminsdk-huamq-e8206454cc.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class Firebase {
  constructor() {
    this.db = admin.firestore();
    this.products = this.db.collection("products");
    this.cart = this.db.collection("cart");
  }

  //--------------PRODUCTOS---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  async getAllProducts() {
    try {
      const productsColl = await this.products.get();
      return productsColl.docs;
    } catch (error) {
      return null;
    }
  }

  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  async getOneProduct(idp) {
    try {
      const doc = this.products.doc(`${idp}`);
      const item = await doc.get();
      return item.data();
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
          timestamp: Date.now(),
          nombre,
          descripcion,
          codigo: Math.floor(Math.random() * (999 - 1)) + 1,
          foto,
          precio,
          stock,
        };
        let productAdd = this.products.doc();
        await productAdd.create(newProduct);
        return newProduct;
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
      const doc = this.products.doc(`${idp}`);
      const item = await doc.update(prod);
      return item;
    } catch (error) {
      return null;
    }
  }

  //METODO PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
  async deleteOneProduct(idp) {
    try {
      const doc = this.products.doc(`${idp}`);
      const item = await doc.delete();
      return item;
    } catch (error) {
      return null;
    }
  }

  //--------------CARRITO---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO
  async getAllProductsCart() {
    try {
      const productsColl = await this.cart.get();
      return productsColl.docs.producto;
    } catch (error) {
      return null;
    }
  }

  //METODO PARA LISTAR UN PRODUCTO GUARDADO EN EL CARRITO POR SU ID
  async getOneProductCart(idc) {
    try {
      const cart = this.getAllProductsCart();
      const prod = cart.producto.find((p) => {
        p.id == idc;
      });
      if (prod) {
        return prod;
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
      const cart = this.getAllProductsCart();
      if (cart) {
        const prod = this.getOneProduct(idp);
        cart.producto.push(prod);
        const doc = this.cart.doc();
        const item = await doc.update(cart.producto);
        return item;
      } else {
        const newCart = {
          timestamp: Date.now(),
          producto: this.getOneProduct(idp),
        };
        const doc = this.cart.doc();
        const item = await doc.create(newCart);
        return item;
      }
    } catch (error) {
      return null;
    }
  }

  //METODO PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
  async deleteOneProductCart(idp) {
    try {
      const cart = this.getAllProductsCart();
      const prod = cart.producto.splice(idp, 1);
      if (prod !== -1) {
        return cart;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}

module.exports = Firebase;
