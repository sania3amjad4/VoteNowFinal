import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

function AdminDashboard() {
  const { admin, polls, createPoll, deletePoll, navigate, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [candidates, setCandidates] = useState('');

  useEffect(() => {
    if (!admin) {
      navigate('admin-login');
    }
  }, [admin, navigate]);

  if (!admin) return null;

  const handleCreatePoll = async () => {
    const candidateList = candidates.split('\n').filter(c => c.trim());
    
    if (!title.trim()) {
      alert('Please enter a poll title!');
      return;
    }
    
    if (candidateList.length < 2) {
      alert('Please add at least 2 candidates!');
      return;
    }
    
    const result = await createPoll(title, candidateList);
    
    if (result.success) {
      setTitle('');
      setCandidates('');
      alert('Poll created successfully!');
    } else {
      alert(result.message || 'Failed to create poll');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm('Delete this poll?')) {
      const result = await deletePoll(pollId);
      if (result.success) {
        alert('Poll deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete poll');
      }
    }
  };

  const getTotalVotes = (poll) => {
    return poll.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  };

  const filteredPolls = polls.filter(poll => {
    const query = searchQuery.toLowerCase();
    return poll.title.toLowerCase().includes(query) || 
           poll.candidates.some(c => c.name.toLowerCase().includes(query));
  });

  return (
    <main className="container" style={{ padding: '1.2rem 0' }}>
      <div className="admin-grid">
        <section>
          <div className="form-card">
            <h3>Create Poll</h3>
            <div>
              <div className="form-row">
                <label>Poll Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  disabled={loading}
                />
              </div>
              <div className="form-row">
                <label>Candidates (one per line)</label>
                <textarea 
                  rows="4" 
                  placeholder="Alice&#10;Bob&#10;Carol" 
                  value={candidates} 
                  onChange={(e) => setCandidates(e.target.value)} 
                  required
                  disabled={loading}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '.6rem' }}>
                <button 
                  className="btn-primary" 
                  onClick={handleCreatePoll}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Poll'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div className="form-card">
              <h3>Manage Polls</h3>
            </div>
            <div className="poll-list">
              {polls.map(poll => (
                <div key={poll._id} className="poll-item">
                  <div>
                    <strong>{poll.title}</strong>
                    <p className="small">
                      {poll.candidates.length} candidates, {getTotalVotes(poll)} votes
                    </p>
                  </div>
                  <button 
                    className="btn-ghost" 
                    onClick={() => handleDeletePoll(poll._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {polls.length === 0 && (
                <div className="poll-item">
                  <p>No polls created yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside>
          <div className="form-card">
            <h3>Statistics</h3>
            <p className="small">Total Polls: {polls.length}</p>
            <p className="small">
              Total Votes Cast: {polls.reduce((sum, p) => sum + getTotalVotes(p), 0)}
            </p>
          </div>

          <div style={{ marginTop: '1rem' }} className="form-card">
            <h3>Search Polls / Candidates</h3>
            <input 
              placeholder="Search title or candidate"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div style={{ marginTop: '.6rem' }}>
              {searchQuery && (
                <div>
                  <p className="small">Found {filteredPolls.length} results</p>
                  {filteredPolls.map(poll => (
                    <div 
                      key={poll._id} 
                      style={{ 
                        marginTop: '.4rem', 
                        padding: '.4rem', 
                        background: 'white', 
                        borderRadius: '4px' 
                      }}
                    >
                      <strong style={{ fontSize: '.85rem' }}>{poll.title}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default AdminDashboard;