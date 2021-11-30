const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default:
      "https://cdn4.iconfinder.com/data/icons/eon-ecommerce-i-1/32/user_profile_man-512.png",
  },
});

module.exports = model("Users", UserSchema);
