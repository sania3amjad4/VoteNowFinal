import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function VoterRegister() {
  const { registerVoter, navigate, loading } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    const result = await registerVoter({ name, email, password });
    
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('voter-login');
    } else {
      alert(result.message || 'Registration failed');
    }
  };

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <div className="form-card" style={{ maxWidth: '640px', margin: 'auto' }}>
        <h3>Voter Registration</h3>
        <div>
          <div className="form-row">
            <label>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
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
              minLength="6"
            />
            <small style={{ color: '#666' }}>Minimum 6 characters</small>
          </div>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <button 
              className="btn-ghost" 
              onClick={() => navigate('voter-login')}
              disabled={loading}
            >
              Already have account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default VoterRegister;