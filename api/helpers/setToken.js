const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (user, tokenExpires = 259200) => {
  const payload = {
    user: {
      id: user.id
    }
  };

  return jwt.sign(payload, config.get("jwtSecret"), { expiresIn: tokenExpires });
};
