const mongoose = require("mongoose");
const { CONNECTION__DB } = require("../constants.js");

async function databaseConnect() {
  await mongoose.connect(CONNECTION__DB);
}

module.exports = databaseConnect;
