const { Schema, model } = require("mongoose");

const MensajeSchema = Schema({
  author: {
    type: String,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
});

module.exports = model("Mensajes", MensajeSchema);
