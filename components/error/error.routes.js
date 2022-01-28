const express = require("express");
const router = express.Router();

//Controller
const { getError } = require("./error.controller");

//Route
router.use(getError);

module.exports = router;
