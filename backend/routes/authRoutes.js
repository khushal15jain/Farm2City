const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, forgotPassword, verifyOtp, toggleBlockUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.put('/user/:id/block', protect, authorize('admin'), toggleBlockUser);

module.exports = router;
