const express = require("express");
const router = express.Router();

//Middlewares
const { validateQuantityProduct } = require("../../middleware/validate-cart");
const { validateId } = require("../../middleware/validate-id");
const { validateRol } = require("../../middleware/validate-rol");

//Controllers
const {
  allCarts,
  listProductsCart,
  listProductCart,
  addProductCart,
  updateProductCart,
  deleteProductCart,
} = require("./cart.controller");

//Routes
router.get("/list/carts", validateRol, allCarts);
router.get("/list", listProductsCart);
router.get("/list/:id_productCart", validateId, listProductCart);
router.post(
  "/add/:id_product",
  [validateId, validateQuantityProduct],
  addProductCart
);
router.put(
  "/update/:id_product",
  [validateId, validateQuantityProduct],
  updateProductCart
);
router.delete("/delete/:id_product", validateId, deleteProductCart);

module.exports = router;
