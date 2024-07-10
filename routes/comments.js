const express = require("express");
const router = express.Router();
const commentsController = require("../controller/commentsController");
const verification = require("../verification");

router.post("/", commentsController.createComment);

router.delete("/:commentId", verification, commentsController.deleteComment);

module.exports = router;