const knex = require("knex");
const { optionsProyFinal } = require("./options/SQLite3");

class SQLite3 {
  constructor() {
    this.knexProyFinal = knex(optionsProyFinal);

    this.knexProyFinal.schema
      .hasTable("products")
      .then((exists) => {
        if (!exists) {
          return this.knexProyFinal.schema
            .createTable("products", (table) => {
              table.increments("id").notNullable().primary();
              table.dateTime("timestamp").notNullable();
              table.string("nombre").notNullable();
              table.string("descripcion").notNullable();
              table.integer("codigo").notNullable();
              table.string("foto").notNullable();
              table.float("precio").notNullable();
              table.integer("stock").notNullable();
              table.integer("habilitado");
            })
            .then(() => console.log("Tabla de productos creada"))
            .catch((err) => console.log(err));
        } else {
          console.log("Tabla productos ya existe");
        }
      })
      .catch((err) => console.log(err));

    this.knexProyFinal.schema
      .hasTable("cart")
      .then((exists) => {
        if (!exists) {
          return this.knexProyFinal.schema
            .createTable("cart", (table) => {
              table.increments("id").notNullable().primary();
              table.dateTime("timestamp").notNullable();
              table.string("nombre").notNullable();
              table.string("descripcion").notNullable();
              table.integer("codigo").notNullable();
              table.string("foto").notNullable();
              table.float("precio").notNullable();
              table.integer("stock").notNullable();
              table.integer("habilitado");
            })
            .then(() => console.log("Tabla de carrito creada"))
            .catch((err) => console.log(err));
        } else {
          console.log("Tabla de carrito ya existe");
        }
      })
      .catch((err) => console.log(err));
  }

  //--------------PRODUCTOS---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  getAllProducts() {
    this.knexProyFinal("products")
      .select(
        "id",
        "timestamp",
        "nombre",
        "descripcion",
        "codigo",
        "foto",
        "precio",
        "stock"
      )
      .where({ habilitado: 1 })
      .then((resultado) => {
        const resultadoJson = JSON.parse(JSON.stringify(resultado));
        return resultadoJson;
      })
      .catch((err) => {
        return null;
      });
  }

  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  getOneProduct(idp) {
    this.knexProyFinal("products")
      .select(
        "id",
        "timestamp",
        "nombre",
        "descripcion",
        "codigo",
        "foto",
        "precio",
        "stock"
      )
      .where({ id: idp })
      .then((resultado) => {
        const resultadoJson = JSON.parse(JSON.stringify(resultado));
        return resultadoJson;
      })
      .catch((err) => {
        return null;
      });
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL LISTADO
  postOneProduct(prod) {
    const newProduct = {
      id: 1,
      timestamp: Date.now(),
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      codigo: Math.floor(Math.random() * (999 - 1)) + 1,
      foto: prod.foto,
      precio: prod.precio,
      stock: prod.stock,
      habilitado: 1,
    };
    console.log(newProduct);
    this.knexProyFinal("products")
      .insert(newProduct)
      .then(() => {
        return newProduct;
      })
      .catch((err) => {
        return null;
      });
    // const { nombre, descripcion, foto, precio, stock } = prod;
    // if (nombre && descripcion && foto && precio && stock) {
    //   const newProduct = {
    //     id: this.products[this.products.length - 1].id + 1 || 1,
    //     timestamp: Date.now(),
    //     nombre,
    //     descripcion,
    //     codigo: Math.floor(Math.random() * (999 - 1)) + 1,
    //     foto,
    //     precio,
    //     stock,
    //   };
    //   this.products.push(newProduct);
    //   const newJsonProducts = JSON.stringify(this.products);
    //   fs.writeFileSync(
    //     path.join(__dirname, "products.json"),
    //     newJsonProducts,
    //     "utf-8"
    //   );
    //   return newProduct;
    // } else {
    //   return null;
    // }
  }

  //METODO PARA ACTUALIZAR UN PRODUCTO POR SI ID
  putOneProduct(idp, prod) {
    // const { foto, precio, stock } = prod;
    // let updateProductindex = this.products.findIndex(
    //   (p) => p.id === Number(idp)
    // );
    // if (updateProductindex !== -1 && foto && precio && stock) {
    //   this.products[updateProductindex].foto = foto;
    //   this.products[updateProductindex].precio = precio;
    //   this.products[updateProductindex].stock = stock;
    //   const newJsonProducts = JSON.stringify(this.products);
    //   fs.writeFileSync(
    //     path.join(__dirname, "products.json"),
    //     newJsonProducts,
    //     "utf-8"
    //   );
    //   return this.products[updateProductindex];
    // } else {
    //   return null;
    // }
  }

  //METODO PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
  deleteOneProduct(idp) {
    // const updateProductindex = this.products.findIndex(
    //   (p) => p.id === Number(idp)
    // );
    // if (updateProductindex !== -1) {
    //   this.products.splice(updateProductindex, 1);
    //   const newJsonProducts = JSON.stringify(this.products);
    //   fs.writeFileSync(
    //     path.join(__dirname, "products.json"),
    //     newJsonProducts,
    //     "utf-8"
    //   );
    //   return this.products;
    // } else {
    //   return null;
    // }
  }

  //--------------CARRITO---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO
  getAllProductsCart() {
    // return this.cart[0].producto;
  }

  //METODO PARA LISTAR UN PRODUCTO GUARDADO EN EL CARRITO POR SU ID
  getOneProductCart(idc) {
    // let productIndex = this.cart[0].producto.findIndex(
    //   (p) => p.id === Number(idc)
    // );
    // if (productIndex !== -1) {
    //   return this.cart[0].producto[productIndex];
    // } else {
    //   return null;
    // }
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL CARRITO POR SU ID
  postOneProductCart(idp) {
    // const addProductIndex = this.products.findIndex(
    //   (p) => p.id === Number(idp)
    // );
    // if (addProductIndex !== -1 && this.cart.length === 0) {
    //   const newCart = {
    //     id: 1,
    //     timestamp: Date.now(),
    //     producto: [this.products[addProductIndex]],
    //   };
    //   const newJsonCart = JSON.stringify(newCart);
    //   fs.writeFileSync(path.join(__dirname, "cart.json"), newJsonCart, "utf-8");
    //   return newCart;
    // } else if (addProductIndex !== -1 && this.cart.length !== 0) {
    //   this.cart[0].producto.push(this.products[addProductIndex]);
    //   const newJsonCart = JSON.stringify(this.cart);
    //   fs.writeFileSync(path.join(__dirname, "cart.json"), newJsonCart, "utf-8");
    //   return this.cart;
    // } else {
    //   return null;
    // }
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

module.exports = SQLite3;
