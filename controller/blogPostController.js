const BlogPost = require('../models/blogPost');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const controller = {};

function checkAuthorization(bodyToken){
  let isAuthorized = false;
  if(!bodyToken) return false;

  const token = bodyToken.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
    if (err) isAuthorized = false;
    isAuthorized = true;
  });
  return isAuthorized;
}

controller.getAllPosts = asyncHandler(async (req, res) => {
  const isAuthorized = await checkAuthorization(req.headers["authorization"]);
  console.log("isAuthorized: " + isAuthorized);
  
  let posts;
  if(isAuthorized) {
    posts = await BlogPost.find().sort({timestamp: -1}).limit(20).exec();
  } else {
    posts = await BlogPost.find({isPublished: true}).sort({timestamp: -1}).limit(20).exec();
  }
  posts.map((post) => {
    if(!(post.content.length > 300)) return;
    post.content = (post.content.slice(0, 300) + '...');
  });

  res.json(posts);
});

controller.createPost = [
  body('title', 'Title must not be empty.').trim().isLength({min: 1, max: 200}).escape(),
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
  const isAuthorized = checkAuthorization(req.headers["authorization"]);

  const post = await BlogPost.findById(req.params.postId).populate('comments').exec();

  if(!isAuthorized && !post.isPublished) {
    res.json({message: "Unauthorized"});
    return;
  };

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
    } else {
      post.isPublished = false;
    };

    await post.save();
    res.json(post);
  })
]

module.exports = controller;