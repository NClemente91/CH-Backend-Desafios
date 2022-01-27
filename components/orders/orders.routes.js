const express = require("express");
const router = express.Router();

//MIDDLEWARE
const { validateId } = require("../../middleware/validate-id");

//CONTROLLERS
const {
  allOrdersUser,
  oneOrderUser,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("./orders.controller");

//RUTAS
router.get("/list", allOrdersUser);
router.get("/list/:id_order", validateId, oneOrderUser);
router.post("/add", addOrder);
router.put("/update/:id_order", validateId, updateOrder);
router.delete("/delete/:id_order", validateId, deleteOrder);

module.exports = router;
