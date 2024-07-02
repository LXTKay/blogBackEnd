const express = require('express');
const router = express.Router();
const blogPostController = require('../controller/blogPostController');

router.get('/', blogPostController.getAllPosts);

router.post('/', blogPostController.createPost);

router.get('/:postId', blogPostController.getPost);

router.delete('/:postId', blogPostController.deletePost);

router.put('/:postId', blogPostController.updatePost);

module.exports = router;