const express = require("express");

const router = express.Router();
const { register, login, getUser, passwordRecovery, resetPassword } = require("../controllers/auth");
const { registerSchema, loginSchema, emailSchema, passwordSchema } = require("../validation/auth");
const { validationMiddleware, checkAuthTokenMiddleware } = require("../middlewares/auth");

router.post("/register", validationMiddleware(registerSchema), register);
router.post("/login", validationMiddleware(loginSchema), login);

router.get("/login", checkAuthTokenMiddleware, getUser);
router.post("/login/recovery", validationMiddleware(emailSchema), passwordRecovery);
// ?????
router.get("/login/recovery/reset", validationMiddleware(passwordSchema), resetPassword);

module.exports = router;
