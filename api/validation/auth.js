const Joi = require("joi");

const authSchemas = {
  registerSchema: Joi.object().keys({
    name: Joi.string().min(3).max(15).alphanum().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).max(15).required()
  }),
  loginSchema: Joi.object().keys({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).max(15).required()
  })
};

module.exports = authSchemas;
