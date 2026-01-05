import express from 'express';
import Poll from '../models/Poll.js';
import Voter from '../models/Voter.js';
import { protect, adminProtect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/polls
// @desc    Get all active polls
// @access  Public
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/polls/:id
// @desc    Get single poll by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    console.error('Get poll error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/polls
// @desc    Create a new poll
// @access  Private (Admin only)
router.post('/', adminProtect, async (req, res) => {
  try {
    const { title, candidates } = req.body;

    if (!title || !candidates) {
      return res.status(400).json({ message: 'Please provide title and candidates' });
    }

    if (!Array.isArray(candidates) || candidates.length < 2) {
      return res.status(400).json({ message: 'At least 2 candidates required' });
    }

    const candidatesArray = candidates.map(name => ({
      name: typeof name === 'string' ? name.trim() : name,
      votes: 0
    }));

    const poll = await Poll.create({
      title,
      candidates: candidatesArray,
      createdBy: 'admin'
    });

    res.status(201).json(poll);
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/polls/:id/vote
// @desc    Cast a vote on a poll
// @access  Private (Authenticated voters only)
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { candidateName } = req.body;
    
    if (!candidateName) {
      return res.status(400).json({ message: 'Please provide candidate name' });
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (poll.status === 'closed') {
      return res.status(400).json({ message: 'This poll is closed' });
    }

    // Check if voter already voted
    const hasVoted = poll.voters.some(v => v.voter.toString() === req.voter._id.toString());
    if (hasVoted) {
      return res.status(400).json({ message: 'You have already voted in this poll' });
    }

    // Find candidate and increment vote
    const candidate = poll.candidates.find(c => c.name === candidateName);
    if (!candidate) {
      return res.status(400).json({ message: 'Candidate not found' });
    }

    candidate.votes += 1;

    // Add voter to poll
    poll.voters.push({
      voter: req.voter._id,
      candidate: candidateName
    });

    await poll.save();

    // Add poll to voter's votedPolls
    await Voter.findByIdAndUpdate(req.voter._id, {
      $addToSet: { votedPolls: poll._id }
    });

    res.json({ message: 'Vote cast successfully', poll });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/polls/:id
// @desc    Delete a poll
// @access  Private (Admin only)
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    await poll.deleteOne();
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/polls/stats/all
// @desc    Get poll statistics
// @access  Private (Admin only)
router.get('/stats/all', adminProtect, async (req, res) => {
  try {
    const totalPolls = await Poll.countDocuments();
    const activePolls = await Poll.countDocuments({ status: 'active' });
    const totalVotes = await Poll.aggregate([
      { $unwind: '$voters' },
      { $count: 'total' }
    ]);

    res.json({
      totalPolls,
      activePolls,
      totalVotes: totalVotes[0]?.total || 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;