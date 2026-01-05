import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

function VotePage() {
  const { voter, polls, castVote, navigate, loading } = useAppContext();
  const [selectedCandidates, setSelectedCandidates] = useState({});

  useEffect(() => {
    if (!voter) {
      navigate('voter-login');
    }
  }, [voter, navigate]);

  if (!voter) return null;

  const handleVote = async (pollId) => {
    const candidate = selectedCandidates[pollId];
    if (!candidate) {
      alert('Please select a candidate!');
      return;
    }

    const result = await castVote(pollId, candidate);
    
    if (result.success) {
      alert('Vote cast successfully!');
      setSelectedCandidates({ ...selectedCandidates, [pollId]: null });
    } else {
      alert(result.message || 'Failed to cast vote');
    }
  };

  const hasVoted = (poll) => {
    return poll.voters.some(v => v.voter === voter._id);
  };

  return (
    <main className="container" style={{ padding: '1.2rem 0' }}>
      <div className="form-card" style={{ marginBottom: '1rem' }}>
        <h3>Vote — Available Polls</h3>
        <p className="small">Select a candidate and cast your vote. Each voter can vote once per poll.</p>
      </div>

      <div className="poll-list">
        {polls.map(poll => {
          const voted = hasVoted(poll);
          return (
            <div key={poll._id} className="form-card">
              <h3>{poll.title}</h3>
              {voted ? (
                <p className="small" style={{color: 'green'}}>
                  ✓ You have already voted in this poll
                </p>
              ) : (
                <>
                  <div style={{ margin: '1rem 0' }}>
                    {poll.candidates.map(candidate => (
                      <div
                        key={candidate._id}
                        className={`candidate-option ${selectedCandidates[poll._id] === candidate.name ? 'selected' : ''}`}
                        onClick={() => !loading && setSelectedCandidates({ 
                          ...selectedCandidates, 
                          [poll._id]: candidate.name 
                        })}
                      >
                        {candidate.name}
                      </div>
                    ))}
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={() => handleVote(poll._id)}
                    disabled={loading}
                  >
                    {loading ? 'Casting Vote...' : 'Cast Vote'}
                  </button>
                </>
              )}
            </div>
          );
        })}
        {polls.length === 0 && (
          <div className="form-card">
            <p>No polls available at the moment.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default VotePage;