const express = require("express");
const router = express.Router();

//CONTROLLERS
const {
  getProductsCart,
  postProductsCart,
  deleteProductsCart,
} = require("../controllers/cart.controller");

//RUTAS
router.get("/listar/:id?", getProductsCart);
router.post("/agregar/:id_producto", postProductsCart);
router.delete("/borrar/:id_producto", deleteProductsCart);

module.exports = router;
