const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("../lib/jwt.js");
const { SECRET_JWT } = require("../constants.js");

exports.login = async (email, password) => {
  // find user

  const user = await User.findOne({ email });


  if (!user) {
    throw new Error("Invalid email or password !");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password !");
  }

  // create the payload
  const payload = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
  console.log(payload)

  // generate the token
  const token = await jwt.sign(payload, SECRET_JWT, { expiresIn: "2d" });

  // if everything goes right return the generated token
  return token;
};

exports.register = async (userData) => {
  const user = await User.exists({ email: userData.email });
  if (user) {
    throw new Error("Email is already in use !");
  }

  return User.create(userData);
};
