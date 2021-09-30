const { Schema, model } = require("mongoose");

const MensajeSchema = Schema(
  {
    producto: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Mensajes", MensajeSchema);
