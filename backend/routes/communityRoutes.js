const express = require('express');
const router = express.Router();
const { getCommunityItems, createCommunityItem, likeCommunityItem, addComment } = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCommunityItems);
router.post('/', protect, createCommunityItem);
router.post('/:id/like', protect, likeCommunityItem);
router.post('/:id/comments', protect, addComment);

module.exports = router;
