require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const bodyToken = req.headers["authorization"];
  if(!bodyToken) return res.json({message: "No token provided"});
  const token = bodyToken.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
    if (err) return res.json({message: "Invalid token"});
    req.authData = authData;
    req.isAuthorized = true;
    next();
  });
};

module.exports = verifyToken;