const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  name: { type: String, default: "Anonymous" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  relatedPost: { type: Schema.Types.ObjectId, ref: 'BlogPost' },
});

module.exports = mongoose.model('Comment', commentSchema);