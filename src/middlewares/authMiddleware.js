const jwt = require("../lib/jwt.js");
const { SECRET_JWT } = require("../constants.js");

exports.auth = async (req, res, next) => {
  const token = req.cookies["token"];

  if (token) {
    try {   
      const decodedToken = await jwt.verify(token, SECRET_JWT);
      // set the token to req.user
      req.user = decodedToken;
      res.locals.user = decodedToken;
      // for conditional in main layout
      res.locals.isAuthenticated = true;
      next();
    } catch (err) {
      console.log(err);
      res.clearCookie("token");
      res.redirect("/users/login");
    }
  } else {
    next();
  }
};

exports.isAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/users/login");
  }
  next();
};
