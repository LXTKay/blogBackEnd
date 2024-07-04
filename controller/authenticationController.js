require('dotenv').config();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const mokUser = {
  id: 1,
  username: "test",
  password: "test"
};

const controller = {};

controller.register = (req, res) => {
  res.json({message: "Register"});
};

controller.login = asyncHandler(async (req, res) => {
  if (!(req.body.username === mokUser.username && req.body.password === mokUser.password)) {
    res.json({message: "wrong username or password"});
    return;
  };

  const username = req.body.username;

  jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120m'}, (err, token) => {
    res.json({token: token, message: "Login successful"});
  });
});

controller.logout = asyncHandler(async (req, res) => {
  const bodyToken = req.headers["authorization"];
  const token = bodyToken.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({message: "Logout"});
  })
  
});

module.exports = controller;