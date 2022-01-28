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

const CartSchema = Schema(
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//Method to modify the data output
CartSchema.methods.toJSON = function () {
  const { createdAt, updatedAt, ...cart } = this.toObject();
  return cart;
};

module.exports = model("Cart", CartSchema);
