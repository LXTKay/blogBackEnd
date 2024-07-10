const express = require("express");
const router = express.Router();
const authenticationController = require("../controller/authenticationController");
const verification = require("../verification");

router.post("/register", authenticationController.register);
router.post("/login", authenticationController.login);
router.post("/logout", verification, authenticationController.logout);

module.exports = router;