const { Schema, model } = require("mongoose");

const ProductSchema = Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
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
ProductSchema.methods.toJSON = function () {
  const { code, createdAt, updatedAt, ...product } = this.toObject();
  return product;
};

module.exports = model("Product", ProductSchema);
