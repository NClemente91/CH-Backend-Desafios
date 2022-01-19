const { Schema, model } = require("mongoose");

const CartSchema = Schema(
  {
    timestamp: {
      type: Number,
    },
    producto: [
      {
        //Para relacionarlo con el schema de Comercio
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Cart", CartSchema);
