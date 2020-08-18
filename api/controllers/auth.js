const bcrypt = require("bcryptjs");
const config = require("config");

const User = require("../database/models/User");
const { createToken, hashPassword, sendRecoverPasswordLink } = require("../helpers/auth");
const { AlreadyExists, InvalidCredentials } = require("../utils/errors");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      throw new AlreadyExists();
    }

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

    if (!user || !isMatch) {
      throw new InvalidCredentials();
    }

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
  // ?????????
  // if (req.query.token) {
  //   return res.status(400).json({ msg: "Can recover" });
  // }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new InvalidCredentials();
    }

    const token = createToken({ user: { id: user.id } }, config.get("forgotPasswordExpiresIn"));
    const setResetUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}?token=${token}`;

    sendRecoverPasswordLink(email, setResetUrl);

    res.json({ msg: "Recover link was sent" });
  } catch (err) {
    console.error(err.message);
    next();
  }
};

module.exports = {
  register,
  login,
  getUser,
  passwordRecovery
};
