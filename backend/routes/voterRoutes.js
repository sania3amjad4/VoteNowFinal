import express from 'express';
import jwt from 'jsonwebtoken';
import Voter from '../models/Voter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id, role = 'voter') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/voters/register
// @desc    Register a new voter
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if voter exists
    const voterExists = await Voter.findOne({ email });
    if (voterExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create voter
    const voter = await Voter.create({
      name,
      email,
      password
    });

    if (voter) {
      res.status(201).json({
        _id: voter._id,
        name: voter.name,
        email: voter.email,
        token: generateToken(voter._id)
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/voters/login
// @desc    Login voter
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const voter = await Voter.findOne({ email });

    if (voter && (await voter.comparePassword(password))) {
      res.json({
        _id: voter._id,
        name: voter.name,
        email: voter.email,
        token: generateToken(voter._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/voters/profile
// @desc    Get voter profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const voter = await Voter.findById(req.voter._id).populate('votedPolls');
    res.json(voter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;