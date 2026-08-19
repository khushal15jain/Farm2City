const Community = require('../models/Community');
const db = require('../config/db');
const offlineDb = require('../config/offlineDb');

const getCommunityItems = async (req, res) => {
  const { type, category } = req.query;

  try {
    let items = [];
    if (db.isOffline()) {
      items = offlineDb.getCollection('community');
    } else {
      items = await Community.find({});
    }

    if (type) {
      items = items.filter(item => item.type === type);
    }

    if (category) {
      items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createCommunityItem = async (req, res) => {
  const { type, title, content, category } = req.body;

  if (!type || !title || !content) {
    return res.status(400).json({ success: false, message: 'Please provide type, title and content' });
  }

  if (type === 'scheme' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only administrators can post official government schemes' });
  }

  try {
    const postData = {
      type,
      title,
      content,
      category: category || 'General',
      author: req.user.name,
      likes: [],
      comments: []
    };

    let newItem;
    if (db.isOffline()) {
      newItem = offlineDb.insert('community', postData);
    } else {
      newItem = await Community.create(postData);
    }

    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const likeCommunityItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  try {
    let item;
    if (db.isOffline()) {
      item = offlineDb.findById('community', id);
    } else {
      item = await Community.findById(id);
    }

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    let updatedLikes = [...(item.likes || [])];
    const isLiked = updatedLikes.includes(userId);

    if (isLiked) {
      updatedLikes = updatedLikes.filter(uid => uid !== userId);
    } else {
      updatedLikes.push(userId);
    }

    let updatedItem;
    if (db.isOffline()) {
      updatedItem = offlineDb.updateById('community', id, { likes: updatedLikes });
    } else {
      item.likes = updatedLikes;
      updatedItem = await item.save();
    }

    return res.json({ success: true, isLiked: !isLiked, likesCount: updatedLikes.length, data: updatedItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ success: false, message: 'Please provide comment text' });

  try {
    let item;
    if (db.isOffline()) {
      item = offlineDb.findById('community', id);
    } else {
      item = await Community.findById(id);
    }

    if (!item) return res.status(404).json({ success: false, message: 'Forum post not found' });

    const newComment = {
      authorName: req.user.name,
      text,
      createdAt: new Date().toISOString()
    };

    let updatedComments = [...(item.comments || [])];
    updatedComments.push(newComment);

    let updatedItem;
    if (db.isOffline()) {
      updatedItem = offlineDb.updateById('community', id, { comments: updatedComments });
    } else {
      item.comments.push(newComment);
      updatedItem = await item.save();
    }

    return res.status(201).json({ success: true, data: updatedItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCommunityItems,
  createCommunityItem,
  likeCommunityItem,
  addComment
};
