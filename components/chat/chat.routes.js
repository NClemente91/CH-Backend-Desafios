const express = require("express");
const router = express.Router();

//CONTROLLERS
const { allMessages, addMessage } = require("./chat.controller");

//RUTAS
router.get("/", allMessages);
router.post("/", addMessage);

module.exports = router;
