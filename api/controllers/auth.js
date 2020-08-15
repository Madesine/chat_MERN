const bcrypt = require("bcryptjs");

const User = require("../database/models/User");
const getToken = require("../helpers/getToken");

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

    getToken(user, res);
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

    getToken(user, res);
  } catch (err) {
    console.log(err.message);

    res.status(500).send("Server error");
  }
};

module.exports = { register, login };
