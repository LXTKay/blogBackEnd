const express = require("express");
const router = express.Router();
const BlogPost = require("../models/blogPost");
const Comment = require("../models/comment");

router.get("/", (req, res) => {
  res.send("Get all comments");
});

router.post("/:id", (req, res) => {
  res.send("Create a comment");
});

router.delete("/:id", (req, res) => {
  res.send("Delete a comment");
});

module.exports = router;