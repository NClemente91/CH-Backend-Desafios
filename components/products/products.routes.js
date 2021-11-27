const express = require("express");
const router = express.Router();

//MIDDLEWARE
const { validateRol } = require("../../middleware/validate-rol");

//CONTROLLERS
const {
  getProducts,
  postProducts,
  putProducts,
  deleteProducts,
} = require("./products.controller");

//RUTAS
router.get("/listar/:id?", getProducts);
router.post("/agregar", validateRol, postProducts);
router.put("/actualizar/:id", validateRol, putProducts);
router.delete("/borrar/:id", validateRol, deleteProducts);

module.exports = router;
