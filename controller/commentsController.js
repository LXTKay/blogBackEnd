const Comment = require('../models/comment');
const BlogPost = require('../models/blogPost');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const controller = {};

controller.createComment = [
  body('name', 'Name must not be empty and be max. 50 characters').trim().isLength({min: 1}).isLength({max: 50}).escape(),
  body('content', 'Content must not be empty and be max 1000 characters').trim().isLength({min: 1}).isLength({max: 1000}).escape(),
  body('postId', 'PostId must not be empty.').trim().isLength({min: 1}),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({errors: errors.array()});
      return;
    }

    const post = await BlogPost.findById(req.body.postId).exec();
    
    if (!post) {
      res.json({errors: ["Post not found"]});
      return;
    };

    const comment = new Comment({
      name: req.body.name,
      content: req.body.content
    });
    await comment.save();

    const commentId = comment._id;
    post.comments.push(commentId);
    await post.save();

    res.json({message: "Comment created", commentId: commentId});
  })
];

controller.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.commentId).exec();
  if (!comment) {
    res.json({message: "Comment not found"});
    return;
  };
  await BlogPost.findOneAndUpdate({comments: req.params.commentId}, {$pull: {comments: req.params.commentId}}).exec();
  res.json({message: "Comment deleted"});
})

module.exports = controller;