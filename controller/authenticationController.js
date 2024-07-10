require('dotenv').config();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require("express-validator")
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const controller = {};

controller.register = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be between 1 and 50 characters long.")
    .escape()
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers."),
  
  body("password")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Password must be between 1 and 50 characters long.")
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({errors: errors.array()});
      return;
    };

    const existingUser = await User.findOne({username: req.body.username}).exec();

    if (existingUser) {
      res.json({errors: ["Username unavailable"]});
      return;
    };

    const password = req.body.password;

    bcryptjs.hash(password, 10, async (err, hash) => {
      const user = new User({
        username: req.body.username,
        passwordHash: hash
      });
      await user.save();
      res.json({message: "User created successfully"});
    })

  })
];

controller.login = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be between 1 and 50 characters long.")
    .escape()
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers."),
  
  body("password")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Password must be between 1 and 50 characters long.")
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({errors: errors.array()});
      return;
    };

    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({username: username}).exec();
    if (!user) {
      res.json({message: "User not found"});
      return;
    };
    bcryptjs.compare(password, user.passwordHash, (err, result) => {
      if (result) {
        jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120m'}, (err, token) => {
          res.json({token: token, message: "Login successful"});
        });
      } else {
        res.json({message: "Wrong password"});
      }
    })
  })
];


//Not needed without refresh token
controller.logout = asyncHandler(async (req, res) => {
  if(!req.isAuthorized) {
    res.json({message: "Not authorized"});
    return;
  };
  res.json({message: "Logged out"});
});

module.exports = controller;