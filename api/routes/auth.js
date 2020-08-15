const express = require("express");

const router = express.Router();
const { register, login } = require("../controllers/auth");
const { registerSchema, loginSchema } = require("../validation/auth");
const { validationMiddleware } = require("../middlewares/auth");

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", validationMiddleware(registerSchema), register);

// @route POST api/auth/login
// @desc Log in user
// @access Public
router.post("/login", validationMiddleware(loginSchema), login);

module.exports = router;
