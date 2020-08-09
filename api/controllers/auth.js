const bcrypt = require("bcryptjs");

const User = require("../database/models/User");

const login = async (req, res) => {
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
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Server error");
  }
  res.json({ msg: "Hello world" });
};

module.exports = { login };
