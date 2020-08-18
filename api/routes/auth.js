const express = require("express");

const router = express.Router();
const { register, login, getUser, passwordRecovery } = require("../controllers/auth");
const { registerSchema, loginSchema, passwordRecoverySchema } = require("../validation/auth");
const { validationMiddleware, checkAuthTokenMiddleware } = require("../middlewares/auth");

router.post("/register", validationMiddleware(registerSchema), register);
router.post("/login", validationMiddleware(loginSchema), login);

router.get("/login", checkAuthTokenMiddleware, getUser);
router.post("/login/recovery", validationMiddleware(passwordRecoverySchema), passwordRecovery);
// ?????
router.get("/login/recovery", passwordRecovery);

module.exports = router;
