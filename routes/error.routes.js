const express = require("express");
const router = express.Router();

//CONTROLLERS
const { getError } = require("../controllers/error.controller");

//RUTAS
router.use(getError);

module.exports = router;
