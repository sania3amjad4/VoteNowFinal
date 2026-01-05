import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function VoterLogin() {
  const { loginVoter, navigate, loading } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    const result = await loginVoter(email, password);
    
    if (result.success) {
      navigate('vote');
    } else {
      alert(result.message || 'Login failed');
    }
  };

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <div className="form-card" style={{ maxWidth: '640px', margin: 'auto' }}>
        <h3>Voter Login</h3>
        <div>
          <div className="form-row">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button 
              className="btn-ghost" 
              onClick={() => navigate('voter-register')}
              disabled={loading}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default VoterLogin;