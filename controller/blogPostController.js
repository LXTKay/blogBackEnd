const BlogPost = require('../models/blogPost');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const controller = {};

controller.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find().exec();

  res.json(posts);
});

controller.createPost = [
  body('title', 'Title must not be empty.').trim().isLength({min: 1}).escape(),
  body('content', 'Content must not be empty.').trim().isLength({min: 1}).escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({errors: errors.array()});
      return;
    }

    const post = new BlogPost({
      title: req.body.title,
      content: req.body.content,
    });

    if (req.body.isPublished) {
      post.isPublished = true;
    };
    await post.save();
  
    res.json(post);
  })
];

controller.getPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.postId).populate('comments').exec();

  res.json(post);
});

controller.deletePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.postId).exec();

  if (!post) {
    res.json({message: 'Post not found'});
    return;
  };

  const commentsArray = post.comments;
  for (let i = 0; i < commentsArray.length; i++) {
    await Comment.findByIdAndDelete(commentsArray[i]);
  };

  await BlogPost.findByIdAndDelete(req.params.postId);
  res.json({ message: 'Post deleted successfully' });
});

controller.updatePost = [
  body('title').trim().escape(),
  body('content').trim().escape(),

  asyncHandler(async (req, res) => {
    const post = await BlogPost.findById(req.params.postId).exec();

    if (!post) {
      res.json({message: 'Post not found'});
      return;
    };

    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;
    if (req.body.isPublished) {
      post.isPublished = true;
    };

    await post.save();
    res.json(post);
  })
]

module.exports = controller;