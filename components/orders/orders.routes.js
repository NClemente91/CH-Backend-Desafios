const express = require("express");
const router = express.Router();

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
router.get("/list/:id_order", oneOrderUser);
router.post("/add", addOrder);
router.put("/update/:id_order", updateOrder);
router.delete("/delete/:id_order", deleteOrder);

module.exports = router;
