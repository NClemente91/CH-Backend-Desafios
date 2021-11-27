const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  codigo: {
    type: Number,
    required: true,
  },
  foto: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

module.exports = model("Product", ProductSchema);
