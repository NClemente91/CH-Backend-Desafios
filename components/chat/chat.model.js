const { Schema, model } = require("mongoose");

const ChatSchema = Schema(
  {
    email: {
      type: String,
      required: true,
    },
    typeUser: {
      type: String,
      require: true,
      enum: ["user", "system"],
    },
    message: {
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
ChatSchema.methods.toJSON = function () {
  const { updatedAt, ...chat } = this.toObject();
  return chat;
};

module.exports = model("Chat", ChatSchema);
