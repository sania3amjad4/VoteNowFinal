import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

function ResultsPage() {
  const { polls, fetchPolls } = useAppContext();

  useEffect(() => {
    fetchPolls(); // Refresh polls when results page loads
  }, []);

  const getTotalVotes = (poll) => {
    return poll.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  };

  return (
    <main className="container" style={{ padding: '1.2rem 0' }}>
      <div className="form-card">
        <h3>Live Results</h3>
        <p className="small">Results are updated in real-time as votes are cast.</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {polls.map(poll => {
          const total = getTotalVotes(poll);
          return (
            <div key={poll._id} className="form-card" style={{ marginBottom: '1rem' }}>
              <h3>{poll.title}</h3>
              <p className="small">Total Votes: {total}</p>
              <div style={{ marginTop: '1rem' }}>
                {poll.candidates.map(candidate => {
                  const votes = candidate.votes || 0;
                  const percentage = total > 0 ? (votes / total * 100).toFixed(1) : 0;
                  return (
                    <div key={candidate._id} style={{ marginBottom: '.8rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '.2rem' 
                      }}>
                        <strong>{candidate.name}</strong>
                        <span>{votes} votes ({percentage}%)</span>
                      </div>
                      <div className="result-bar">
                        <div className="result-fill" style={{ width: `${percentage}%` }}>
                          {percentage > 10 && `${percentage}%`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {polls.length === 0 && (
          <div className="form-card">
            <p>No polls available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default ResultsPage;