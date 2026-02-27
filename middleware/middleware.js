const jwt = require('jsonwebtoken');
const User = require('../models/userSchema')

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id)
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" }); 
    }
    req.user = user
    
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;