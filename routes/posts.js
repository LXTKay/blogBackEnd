const express = require('express');
const router = express.Router();
const blogPostController = require('../controller/blogPostController');
const verification = require('../verification');

router.get('/', blogPostController.getAllPosts);

router.post('/', verification, blogPostController.createPost);

router.get('/:postId', blogPostController.getPost);

router.delete('/:postId', verification, blogPostController.deletePost);

router.put('/:postId', verification, blogPostController.updatePost);

module.exports = router;