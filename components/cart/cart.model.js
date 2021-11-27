const { Schema, model } = require("mongoose");

const CartSchema = Schema({
  timestamp: {
    type: Number,
  },
  producto: {
    type: Array,
  },
});

module.exports = model("Cart", CartSchema);
