const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const communitySchema = new mongoose.Schema({
  type: { type: String, enum: ['scheme', 'tip', 'forum'], default: 'forum' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, default: 'General' },
  likes: [{ type: String }],
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);
