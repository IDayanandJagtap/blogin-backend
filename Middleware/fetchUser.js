const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const fetchUser = async (req, res, next) => {
  const jsonToken = req.header("auth-token");

  if (!jsonToken) {
    res.status(401).send({ success: false, error: "Unauthorised access" });
    return;
  }
  try {
    const tokenData = jwt.verify(jsonToken, JWT_SECRET_KEY);
    if (!tokenData) {
      res.status(401).send({ success: false, error: "Unauthorised access" });
      return;
    }

    req.user = tokenData.user;
    next();
  } catch (err) {
    res.status(500).send({ success: false, error: "Something went wrong!" });
  }
};

module.exports = fetchUser;
