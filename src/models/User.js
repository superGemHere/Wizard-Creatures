const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../constants.js");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true,"First name is required !"],
    minLenght: [3, 'First name must be atleast 3 characters long.']
  },
  lastName: {
    type: String,
    required: [true,"Last name is required !"],
    minLenght: [3, 'Last name must be atleast 3 characters long.']
  },
  email: {
    type: String,
    required: [true,"Email is required !"],
    minLenght: [10, 'Email must be atleast 10 characters long.']
  },
  password: {
    type: String,
    required: [true,"Password is required !"],
    minLenght: [4, 'Password must be atleast 4 characters long.']
  },
});

userSchema.virtual("repeatPassword").set(function (value) {
  if (this.password !== value) {
    throw new Error("Password missmatch !");
  }
});

userSchema.pre("save", async function () {
  const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.password = hash;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
