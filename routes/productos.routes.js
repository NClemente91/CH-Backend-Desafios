const express = require("express");
const router = express.Router();

//CONTROLLERS
const {
  getVistaTest,
  getAllProducts,
  getOneProduct,
  postOneProduct,
  putOneProduct,
  delOneProduct,
} = require("../controllers/products.controller");

//RUTAS
//Ruta para desafio clase 22
router.get("/productos/vista-test", getVistaTest);

//Ruta para mostrar todos los productos
router.get("/productos/listar", getAllProducts);

//Ruta para mostrar un producto en particular
router.get("/productos/listar/:id", getOneProduct);

//Ruta para cargar un producto
router.post("/productos/guardar/", postOneProduct);

//Ruta para actualizar un producto
router.put("/productos/actualizar/:id", putOneProduct);

//Ruta para borrar un producto
router.delete("/productos/borrar/:id", delOneProduct);

module.exports = router;
