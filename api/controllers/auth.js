const bcrypt = require("bcryptjs");
const config = require("config");

const User = require("../database/models/User");
const { createToken, hashPassword, sendRecoverPasswordLink } = require("../helpers/auth");
const { AlreadyExists, InvalidCredentials, BadRequest } = require("../utils/errors");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) throw new AlreadyExists();

    user = new User({ name, email, password });
    user.password = await hashPassword(password);

    await user.save();

    const token = createToken({ user: { id: user.id } }, config.get("authExpiresIn"));

    res.cookie("auth-token", token, { httpOnly: true, maxAge: config.get("authExpiresIn") });
    res.json({ msg: "Successfully registered" });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) throw new InvalidCredentials();

    const token = createToken({ user: { id: user.id } }, config.get("authExpiresIn"));

    res.cookie("auth-token", token, { httpOnly: true, maxAge: config.get("authExpiresIn") });
    res.json({ msg: "Successfully logged" });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({ user });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const passwordRecovery = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) throw new InvalidCredentials();

    const token = createToken({ user: { id: user.id } }, config.get("forgotPasswordExpiresIn"));
    const setResetUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}/reset?token=${token}`;

    sendRecoverPasswordLink(email, setResetUrl);

    res.json({ msg: "Recover link was sent" });
  } catch (error) {
    console.error(err.message);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user.password === password) throw new BadRequest("Your new password can not be similar to current password");
    user.password = password;

    await user.save();

    res.json({ msg: "Password successfully changed" });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  register,
  login,
  getUser,
  passwordRecovery,
  resetPassword
};
