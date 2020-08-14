const express = require("express");

const router = express.Router();
const { register } = require("../controllers/auth");
const { registerSchema } = require("../validation/auth");
const { validationMiddleware } = require("../middlewares/auth");

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", validationMiddleware(registerSchema), register);

module.exports = router;
