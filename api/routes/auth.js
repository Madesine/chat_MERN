const express = require("express");

const router = express.Router();
const { register, login, getUser } = require("../controllers/auth");
const { registerSchema, loginSchema } = require("../validation/auth");
const { validationMiddleware, isTokenMiddleware } = require("../middlewares/auth");

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", validationMiddleware(registerSchema), register);

// @route POST api/auth/login
// @desc Log in user
// @access Public
router.post("/login", validationMiddleware(loginSchema), login);

// @route GET api/auth/login
// @desc Get user
// @access Private
router.get("/login", isTokenMiddleware, getUser);

module.exports = router;
