const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (user, res) => {
  const payload = {
    user: {
      id: user.id
    }
  };

  jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 36000 }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
};
