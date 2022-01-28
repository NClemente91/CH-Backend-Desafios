const express = require("express");
const router = express.Router();

//Middlewares
const { validateId } = require("../../middleware/validate-id");
const { validateStateOrder } = require("../../middleware/validate-order");

//Controllers
const {
  allOrdersUser,
  oneOrderUser,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("./orders.controller");

//Routes
router.get("/list", allOrdersUser);
router.get("/list/:id_order", validateId, oneOrderUser);
router.post("/add", addOrder);
router.put("/update/:id_order", [validateId, validateStateOrder], updateOrder);
router.delete("/delete/:id_order", validateId, deleteOrder);

module.exports = router;
