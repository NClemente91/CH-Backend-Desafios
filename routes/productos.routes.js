const express = require("express");
const router = express.Router();
const { optionsMDB } = require("../options/mariaDB");
const knex = require("knex")(optionsMDB);

//CREAMOS LA TABLA PRODUCTOS VERIFICANDO SI YA EXISTE O NO
knex.schema
  .hasTable("products")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("products", (table) => {
          table.increments("_id").notNullable().primary();
          table.string("title").notNullable();
          table.float("price").notNullable();
          table.string("thumbnail").notNullable();
          table.integer("habilitado");
        })
        .then(() => console.log("Tabla de productos creada"))
        .catch((err) => console.log(err));
    } else {
      console.log("Tabla productos ya existe");
    }
  })
  .catch((err) => console.log(err));

//RUTAS
//Ruta para un desafío en particular
router.get("/", (req, res) => {
  try {
    res.sendFile("index.html", { root: __dirname });
  } catch (error) {
    console.log(error);
  }
});

//Ruta para un desafío en particular
// router.get("/productos/vista", (req, res) => {
//   try {
//     let productExist;
//     productos.length === 0 ? (productExist = false) : (productExist = true);
//     res.render("pages/index", { productos, productExist });
//   } catch (error) {
//     console.log(error);
//   }
// });

//Ruta para mostrar todos los productos
router.get("/productos/listar", (req, res) => {
  try {
    knex("products")
      .select("title", "price", "thumbnail")
      .where({ habilitado: 1 })
      .then((resultado) => {
        const resultadoJson = JSON.parse(JSON.stringify(resultado));
        if (resultado.length !== 0) {
          return res.status(200).json(resultadoJson);
        } else {
          return res.status(404).json({ error: "No hay productos" });
        }
      })
      .catch((err) => {
        return res.status(404).json({ error: "Dato erróneo" });
      });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//Ruta para mostrar un producto en particular
router.get("/productos/listar/:id", (req, res) => {
  try {
    const id = req.params.id;
    knex("products")
      .select("title", "price", "thumbnail")
      .where({ habilitado: 1, _id: id })
      .then((resultado) => {
        const resultadoJson = JSON.parse(JSON.stringify(resultado));
        if (resultado.length !== 0) {
          return res.status(200).json(resultadoJson[0]);
        } else {
          return res.status(404).json({ error: "Producto no encontrado" });
        }
      })
      .catch((err) => {
        return res.status(404).json({ error: "Dato erróneo" });
      });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//Ruta para cargar un producto
router.post("/productos/guardar/", (req, res) => {
  try {
    const prod = req.body;
    prod.price = Number(prod.price);
    prod.habilitado = 1;
    knex("products")
      .insert(prod)
      .then(() => {
        return res.status(200).redirect("http://localhost:5050/");
      })
      .catch((err) => {
        return res.status(404).json({ error: "Dato erróneo" });
      });
  } catch (error) {
    return res.status(404).json({ error: "error al ingresar el producto" });
  }
});

//Ruta para actualizar un producto
router.put("/productos/actualizar/:id", (req, res) => {
  try {
    const idp = req.params.id;
    knex("products")
      .where({ _id: idp })
      .update(req.body)
      .then((resultado) => {
        console.log(resultado);
        if (resultado === 1) {
          return res.status(200).json({ message: "Producto Actualizado" });
        } else {
          return res.status(404).json({ error: "Producto no encontrado" });
        }
      })
      .catch((err) => {
        return res.status(404).json({ error: "Dato erróneo" });
      });
  } catch (error) {
    return res.status(404).json({ error });
  }
});

//Ruta para borrar un producto
router.delete("/productos/borrar/:id", (req, res) => {
  try {
    const idp = req.params.id;
    knex("products")
      .where({ _id: idp })
      .del()
      .then((resultado) => {
        if (resultado === 1) {
          return res.status(200).json({ message: "Producto Borrado" });
        } else {
          return res.status(404).json({ error: "Producto no encontrado" });
        }
      })
      .catch((err) => {
        return res.status(404).json({ error: "Dato erróneo" });
      });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
