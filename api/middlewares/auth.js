const jwt = require("jsonwebtoken");
const config = require("config");

const getTokenMiddleware = (req, res, next) => {
  //	COOKIE NEEDED
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

const validationMiddleware = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(",");

      console.log("error", message);
      res.status(422).json({ error: message });
    }
  };
};

module.exports = { getTokenMiddleware, validationMiddleware };
