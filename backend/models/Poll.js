import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Poll title is required'],
    trim: true
  },
  candidates: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  voters: [{
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voter'
    },
    candidate: {
      type: String,
      required: true
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Virtual for total votes
pollSchema.virtual('totalVotes').get(function() {
  return this.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
});

// Ensure virtuals are included in JSON
pollSchema.set('toJSON', { virtuals: true });
pollSchema.set('toObject', { virtuals: true });

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;