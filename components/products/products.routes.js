const express = require("express");
const router = express.Router();

//Middlewares
const { validateId } = require("../../middleware/validate-id");
const {
  validateCategory,
  validateAddProduct,
  validateUpdateProduct,
} = require("../../middleware/validate-products");
const { validateRol } = require("../../middleware/validate-rol");

//Controllers
const {
  allProducts,
  oneProduct,
  categoryProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./products.controller");

//Routes
router.get("/list", allProducts);
router.get("/list/:_id", validateId, oneProduct);
router.get("/list/category/:_category", validateCategory, categoryProducts);
router.post("/add", [validateRol, validateAddProduct], addProduct);
router.put(
  "/update/:_id",
  [validateId, validateRol, validateUpdateProduct],
  updateProduct
);
router.delete("/delete/:_id", validateId, validateRol, deleteProduct);

module.exports = router;
