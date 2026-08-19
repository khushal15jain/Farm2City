const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');
const offlineDb = require('../config/offlineDb');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'farm2city_super_secret_jwt_key_2026');

      if (db.isOffline()) {
        const user = offlineDb.findById('users', decoded.id);
        if (!user) {
          return res.status(401).json({ success: false, message: 'User authorization failed' });
        }
        if (user.isBlocked) {
          return res.status(403).json({ success: false, message: 'Your account has been suspended by administration' });
        }
        req.user = user;
      } else {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ success: false, message: 'User authorization failed' });
        }
        if (user.isBlocked) {
          return res.status(403).json({ success: false, message: 'Your account has been suspended by administration' });
        }
        req.user = user;
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
