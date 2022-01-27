const express = require("express");
const router = express.Router();

//MIDDLEWARE
const { validateId } = require("../../middleware/validate-id");

//CONTROLLERS
const {
  allCarts,
  listProductCart,
  listProductsCart,
  addProductCart,
  updateProductCart,
  deleteProductCart,
} = require("./cart.controller");

//RUTAS
router.get("/list/carts", allCarts);
router.get("/list", listProductsCart);
router.get("/list/:id_productCart", validateId, listProductsCart);
router.post("/add/:id_product", validateId, addProductCart);
router.put("/update/:id_product", validateId, updateProductCart);
router.delete("/delete/:id_product", validateId, deleteProductCart);

module.exports = router;
