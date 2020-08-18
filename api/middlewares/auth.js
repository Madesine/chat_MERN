const jwt = require("jsonwebtoken");
const config = require("config");

const { Unauthorized, CustomError } = require("../utils/errors");

const checkAuthTokenMiddleware = (req, res, next) => {
  const token = req.cookies["auth-token"];

  if (!token) {
    throw new Unauthorized("No token, authorization denied");
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    throw new Unauthorized("Token is not valid");
  }
};

const validationMiddleware = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;

      const errorMessages = details.map(detail => {
        return { [detail.context.key]: detail.message };
      });

      throw new CustomError(422, "Unprocessable Entity", "Invalid data", errorMessages);
    }
  };
};

module.exports = { checkAuthTokenMiddleware, validationMiddleware };
