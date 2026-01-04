import jwt from 'jsonwebtoken';
import Voter from '../models/Voter.js';

// Protect voter routes
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.voter = await Voter.findById(decoded.id).select('-password');
      
      if (!req.voter) {
        return res.status(401).json({ message: 'Not authorized, voter not found' });
      }
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Protect admin routes
export const adminProtect = (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin token verification error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};