const bcrypt = require("bcryptjs");

const User = require("../database/models/User");
const setToken = require("../helpers/setToken");
const sendEmail = require("../helpers/sendEmail");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "Already exists" }] });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = setToken(user);

    res.cookie("auth-token", token, { httpOnly: true, maxAge: 259200 });
    res.json({ msg: "Successfully registered" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const token = setToken(user);

    res.cookie("auth-token", token, { httpOnly: true, maxAge: 259200 });
    res.json({ msg: "Successfully logged" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const passwordRecovery = async (req, res) => {
  if (!req.params) {
    return res.json({ msg: "loh" });
  }

  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const token = setToken(user, 600);
    const setResetUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}?token=${token}`;

    sendEmail(email, res, setResetUrl);

    res.json({ setResetUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = { register, login, getUser, passwordRecovery };
