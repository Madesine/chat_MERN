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

    const authToken = setToken(user);

    res.json({ authToken });
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

    const authToken = setToken(user);

    res.json({ authToken });
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

const resetPasswordMail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const resetPasswordToken = setToken(user, 600);
    const setResetUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}?token=${resetPasswordToken}`;

    sendEmail(email, res, setResetUrl);

    res.json({ setResetUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = { register, login, getUser, resetPasswordMail };
