const express = require("express");
const router = express.Router();
const commentsController = require("../controller/commentsController");

router.post("/", commentsController.createComment);

router.delete("/:commentId", commentsController.deleteComment);

module.exports = router;