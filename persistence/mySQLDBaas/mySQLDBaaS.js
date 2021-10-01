const { optionsMDB } = require("./options/mariaDB");
const knex = require("knex");

class MySQLDBaaS {
  constructor() {
    this.knex = knex(optionsMDB);

    this.knex.schema
      .hasTable("products")
      .then((exists) => {
        if (!exists) {
          return this.knex.schema
            .createTable("products", (table) => {
              table.increments("id").notNullable().primary();
              table.date("timestamp").notNullable();
              table.string("nombre").notNullable();
              table.string("descripcion").notNullable();
              table.integer("codigo").notNullable();
              table.string("foto").notNullable();
              table.float("precio").notNullable();
              table.integer("stock").notNullable();
              table.integer("habilitado");
            })
            .then(() => console.log("Tabla productos creada"))
            .catch((err) => console.log(err));
        } else {
          console.log("Tabla productos ya existe");
        }
      })
      .catch((err) => console.log(err));

    this.knex.schema
      .hasTable("cart")
      .then((exists) => {
        if (!exists) {
          return this.knex.schema
            .createTable("cart", (table) => {
              table.increments("id").notNullable().primary();
              table.dateTime("timestamp").notNullable();
              table.string("producto");
            })
            .then(() => console.log("Tabla cart creada"))
            .catch((err) => console.log(err));
        } else {
          console.log("Tabla cart ya existe");
        }
      })
      .catch((err) => console.log(err));
  }

  //--------------PRODUCTOS---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  getAllProducts() {
    try {
      this.knex("products")
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
          if (resultado.length !== 0) {
            return resultadoJson;
          } else {
            return null;
          }
        })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return null;
        });
    } catch (error) {
      return null;
    }
  }

  //METODO PARA LISTAR TODOS LOS PRODUCTOS DISPONIBLES
  getOneProduct(idp) {
    try {
      this.knex("products")
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
        .where({ habilitado: 1, id: Number(idp) })
        .then((resultado) => {
          const resultadoJson = JSON.parse(JSON.stringify(resultado));
          if (resultado.length !== 0) {
            return resultadoJson[0];
          } else {
            return null;
          }
        })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return null;
        });
    } catch (error) {
      return null;
    }
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL LISTADO
  postOneProduct(prod) {
    try {
      const { nombre, descripcion, foto, precio, stock } = prod;
      if (nombre && descripcion && foto && precio && stock) {
        const newProduct = {
          timestamp: Date.now(),
          nombre,
          descripcion,
          codigo: Math.floor(Math.random() * (999 - 1)) + 1,
          foto,
          precio: Number(precio),
          stock,
          habilitado: 1,
        };
        this.knex("products")
          .insert(newProduct)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            return null;
          });
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //METODO PARA ACTUALIZAR UN PRODUCTO POR SI ID
  putOneProduct(idp, prod) {
    try {
      this.knex("products")
        .where({ id: Number(idp) })
        .update(prod)
        .then((resultado) => {
          if (resultado === 1) {
            return resultado;
          } else {
            return null;
          }
        })
        .catch((err) => {
          return null;
        });
    } catch (error) {
      return null;
    }
  }

  //METODO PARA BORRAR UN PRODUCTO POR SI ID (Falta volver a escribir el aRCHIVO)
  deleteOneProduct(idp) {
    try {
      this.knex("products")
        .where({ id: Number(idp) })
        .del()
        .then((resultado) => {
          if (resultado === 1) {
            return resultado;
          } else {
            return null;
          }
        })
        .catch((err) => {
          return null;
        });
    } catch (error) {
      return null;
    }
  }

  //--------------CARRITO---------------//
  //METODO PARA LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO
  getAllProductsCart() {
    try {
      this.knex("cart")
        .select("id", "timestamp", "producto")
        .where({ habilitado: 1 })
        .then((resultado) => {
          const resultadoJson = JSON.parse(JSON.stringify(resultado));
          if (resultado.length !== 0) {
            return resultadoJson.producto;
          } else {
            return null;
          }
        })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return null;
        });
    } catch (error) {
      return null;
    }
  }

  //METODO PARA LISTAR UN PRODUCTO GUARDADO EN EL CARRITO POR SU ID
  getOneProductCart(idc) {
    try {
      this.knex("cart")
        .select("id", "timestamp", "producto")
        .where({ habilitado: 1 })
        .then((resultado) => {
          const resultadoJson = JSON.parse(JSON.stringify(resultado));
          if (resultado.length !== 0) {
            const res = resultadoJson[0].producto.find((p) => p.id === idc);
            return res;
          } else {
            return null;
          }
        })
        .catch((err) => {
          return null;
        });
    } catch (error) {
      return null;
    }
  }

  //METODO PARA INCORPORAR UN PRODUCTO AL CARRITO POR SU ID
  postOneProductCart(idp) {
    try {
      const prod = this.getOneProduct(idp);
      if (prod) {
        this.knex("cart")
          .insert(prod)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            return null;
          });
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //METODO PARA BORRAR UN PRODUCTO DEL CARRITO POR SI ID
  deleteOneProductCart(idp) {
    try {
      knex("products")
        .where({ id: idp })
        .del()
        .then((resultado) => {
          if (resultado === 1) {
            return resultado;
          } else {
            return null;
          }
        })
        .catch((err) => {
          return null;
        });
    } catch (error) {
      return null;
    }
  }
}

module.exports = MySQLDBaaS;
