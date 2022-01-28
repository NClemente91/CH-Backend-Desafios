const express = require("express");
const router = express.Router();

//Middleware
const { validateAddMessageChat } = require("../../middleware/validate-chat");

//Controllers
const { allMessages, addMessage } = require("./chat.controller");

//Routes
router.get("/", allMessages);
router.post("/", validateAddMessageChat, addMessage);

module.exports = router;
