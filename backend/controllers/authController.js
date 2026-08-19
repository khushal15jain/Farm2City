const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');
const offlineDb = require('../config/offlineDb');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'farm2city_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc Register User
const registerUser = async (req, res) => {
  const { name, email, password, role, phone, villageName, cityName } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
  }

  try {
    let userExists;
    if (db.isOffline()) {
      userExists = offlineDb.findOne('users', { email });
    } else {
      userExists = await User.findOne({ email });
    }

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      phone: phone || '',
      villageName: villageName || '',
      cityName: cityName || '',
      earnings: 0,
      isVerified: true,
      isBlocked: false
    };

    let newUser;
    if (db.isOffline()) {
      newUser = offlineDb.insert('users', userData);
    } else {
      newUser = await User.create(userData);
    }

    const token = generateToken(newUser._id);
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    return res.status(201).json({
      success: true,
      token,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    let user;
    if (db.isOffline()) {
      user = offlineDb.findOne('users', { email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by administration' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return res.json({
      success: true,
      token,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = { ...req.user };
    if (user.password) delete user.password;
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Forgot Password (OTP mock)
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Please provide email' });
  return res.json({ success: true, message: 'OTP sent to your registered email/phone: 123456' });
};

// @desc Verify OTP & Reset Password
const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password' });
  }
  if (otp !== '123456') {
    return res.status(400).json({ success: false, message: 'Invalid OTP code' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (db.isOffline()) {
      const user = offlineDb.findOne('users', { email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      offlineDb.updateById('users', user._id, { password: hashedPassword });
    } else {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.password = hashedPassword;
      await user.save();
    }

    return res.json({ success: true, message: 'Password updated successfully. Please login with your new password.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin Toggle Block User
const toggleBlockUser = async (req, res) => {
  const { id } = req.params;
  try {
    let user;
    if (db.isOffline()) {
      user = offlineDb.findById('users', id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user = offlineDb.updateById('users', id, { isBlocked: !user.isBlocked });
    } else {
      user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.isBlocked = !user.isBlocked;
      await user.save();
    }
    return res.json({ success: true, message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'} successfully`, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  verifyOtp,
  toggleBlockUser
};
