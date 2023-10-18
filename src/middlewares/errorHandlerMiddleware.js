const { getErrorMessage } = require("../utils/errorHelpers.js")
exports.errorHandler = (err, req, res) => {
  res.render("404", {error: getErrorMessage});
};
