const { Unauthorized, CustomError, NotFound } = require("../utils/errors");
const { decodeToken } = require("../helpers/auth");

const checkAuthTokenMiddleware = (req, res, next) => {
  const token = req.cookies["auth-token"];

  if (!token) {
    throw new Unauthorized("No token, authorization denied");
  }

  try {
    const decoded = decodeToken(token);

    req.user = decoded.user;
    next();
  } catch (err) {
    throw new Unauthorized("Token is not valid");
  }
};

const checkForgotPasswordTokenMiddleware = (req, res, next) => {
  const { token } = req.query;

  const decodedToken = decodeToken(token);

  if (!token || !decodedToken) throw new NotFound();

  req.user = decodedToken.user;
  next();
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

module.exports = {
  checkAuthTokenMiddleware,
  validationMiddleware,
  checkForgotPasswordTokenMiddleware
};
