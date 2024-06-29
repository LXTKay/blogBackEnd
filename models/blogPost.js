const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  comments: { type: Array, default: [] },
  isPublished: { type: Boolean, default: false },
});

module.exports = mongoose.model('BlogPost', blogPostSchema);