import express from 'express';
import jwt from 'jsonwebtoken';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

// Generate admin token
const generateAdminToken = () => {
  return jwt.sign(
    { email: process.env.ADMIN_EMAIL, role: 'admin' }, 
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      res.json({
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        token: generateAdminToken()
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/admin/verify
// @desc    Verify admin token
// @access  Private (Admin)
router.get('/verify', adminProtect, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

export default router;