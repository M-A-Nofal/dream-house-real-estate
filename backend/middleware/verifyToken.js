const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    const error = appError.create("Unauthorized", 401, httpStatusText.ERROR);
    return next(error);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    const error = appError.create("invalid token", 401, httpStatusText.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
