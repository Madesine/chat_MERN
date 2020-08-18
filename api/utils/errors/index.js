const CustomError = require("./CustomError");

const BadRequest = require("./BadRequest/BadRequest");
const AlreadyExists = require("./BadRequest/AlreadyExists");
const InvalidCredentials = require("./BadRequest/InvalidCredentials");

const Unauthorized = require("./Unauthorized/Unauthorized");

module.exports = {
  CustomError,
  BadRequest,
  AlreadyExists,
  InvalidCredentials,
  Unauthorized
};
