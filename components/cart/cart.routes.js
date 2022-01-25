const express = require("express");
const router = express.Router();

//CONTROLLERS
const {
  allCarts,
  listProductsCart,
  addProductCart,
  updateProductCart,
  deleteProductCart,
} = require("./cart.controller");

//RUTAS
router.get("/list/carts", allCarts);
router.get("/list/:id_productCart?", listProductsCart);
router.post("/add/:id_product", addProductCart);
router.put("/update/:id_product", updateProductCart);
router.delete("/delete/:id_product", deleteProductCart);

module.exports = router;
