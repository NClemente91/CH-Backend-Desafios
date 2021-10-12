const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

module.exports = model("Productos", ProductoSchema);
