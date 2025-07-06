const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};