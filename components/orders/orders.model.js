const { Schema, model } = require("mongoose");

const ItemSchema = Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity can not be less then 1."],
  },
});

const OrderSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    products: [ItemSchema],
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: [
        "order generated",
        "order prepared",
        "order shipped",
        "order delivered",
      ],
      default: "order generated",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

OrderSchema.methods.toJSON = function () {
  const { updatedAt, ...cart } = this.toObject();
  return cart;
};

module.exports = model("Order", OrderSchema);
