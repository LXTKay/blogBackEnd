const express = require('express');
const router = express.Router();
const blogPost = require('../models/blogPost');

router.get('/', (req, res) => {
  res.send('Get all posts');
});

router.post('/', (req, res) => {
  res.send('Create a post');
});

router.get('/:postId', (req, res) => {
  res.send("Get post with id:");
});

router.delete('/:postId', (req, res) => {
  res.send("Delete post with id:");
});

router.put('/:postId', (req, res) => {
  res.send("Update post with id:");
});

module.exports = router;