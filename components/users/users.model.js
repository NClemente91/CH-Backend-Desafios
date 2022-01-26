const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
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
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://cdn4.iconfinder.com/data/icons/eon-ecommerce-i-1/32/user_profile_man-512.png",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.toJSON = function () {
  const { password, createdAt, updatedAt, ...user } = this.toObject();
  return user;
};

module.exports = model("Users", UserSchema);
