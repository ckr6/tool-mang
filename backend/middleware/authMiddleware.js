const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);
      req.user = await User.findByPk(decoded.id);
      
      if (!req.user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      console.log('User authorized:', req.user);
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('User is admin:', req.user);
    next();
  } else {
    console.log('User is not admin:', req.user);
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
