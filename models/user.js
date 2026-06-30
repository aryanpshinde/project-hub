const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

userSchema.plugin(passportLocalMongoose.default);

const User = model("User", userSchema);

module.exports = User;
