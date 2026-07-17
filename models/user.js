const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dxjv8qg0f/image/upload/v1690911685/avatars/default-avatar.png",
      },
      fileId: {
        type: String,
        default: "default-avatar",
      },
      name: {
        type: String,
        required: true,
        default: "default-avatar",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(passportLocalMongoose.default);

const User = model("User", userSchema);

module.exports = User;
