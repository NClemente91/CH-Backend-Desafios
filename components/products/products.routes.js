const express = require("express");
const router = express.Router();

//MIDDLEWARE
const { validateRol } = require("../../middleware/validate-rol");

//CONTROLLERS
const {
  allProducts,
  oneProduct,
  categoryProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./products.controller");

//RUTAS
router.get("/list", allProducts);
router.get("/list/:_id", oneProduct);
router.get("/list/category/:_category", categoryProducts);
router.post("/add", validateRol, addProduct);
router.put("/update/:_id", validateRol, updateProduct);
router.delete("/delete/:_id", validateRol, deleteProduct);

module.exports = router;
