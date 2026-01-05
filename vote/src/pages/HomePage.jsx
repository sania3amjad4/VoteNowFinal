import React from 'react';
import { useAppContext } from '../context/AppContext';

function HomePage() {
  const { navigate } = useAppContext();

  return (
    <main className="container hero">
      <section className="left">
        <h2>VoteNow — Digital Election Platform</h2>
        <p>
          A modern, responsive frontend prototype for running elections online.
          <br /> This demo includes Voter Authentication, Poll Creation, Voting UI,<br />
          Live Results, and an Admin Dashboard (frontend-only prototype).
        </p>

        <div className="cta-row">
          <button className="btn" onClick={() => navigate('voter-login')}>
            Login as Voter
          </button>
          <button className="btn outline" onClick={() => navigate('voter-register')}>
            Register
          </button>
          <button className="btn" onClick={() => navigate('admin-login')}>
            Admin Login
          </button>
        </div>

        <ul className="features">
          <li>Voter Authentication (client-side)</li>
          <li>Poll creation & candidate management (admin)</li>
          <li>Interactive voting & client-side validation</li>
          <li>Live results & simple charts (simulated)</li>
        </ul>
      </section>
    </main>
  );
}

export default HomePage;