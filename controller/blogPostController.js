const blogPost = require('../models/blogPost');
const comment = require('../models/comment');
const asyncHandler = require('express-async-handler');

const controller = {};

controller.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await blogPost.find().exec();

  res.json(posts);
});

controller.createPost = asyncHandler(async (req, res) => {
  const post = new blogPost({
    title: req.body.title,
    content: req.body.content,
    isPublished: req.body.isPublished
  });
  await post.save();

  res.json(post);
});

controller.getPost = asyncHandler(async (req, res) => {
  const post = await blogPost.findById(req.params.postId).populate('comments').exec();

  res.json(post);
});

controller.deletePost = asyncHandler(async (req, res) => {
  //const post = await blogPost.findById(req.params.postId).exec();
  await blogPost.findByIdAndDelete(req.params.postId);
  res.json({ message: 'Post deleted successfully' });
});

controller.updatePost = asyncHandler(async (req, res) => {
  const post = await blogPost.findById(req.params.postId).exec();
  post.title = req.body.title;
  post.content = req.body.content;
  await post.save();
  res.json(post);
});

module.exports = controller;