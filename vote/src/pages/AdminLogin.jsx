import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function AdminLogin() {
  const { loginAdmin, navigate, loading } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    const result = await loginAdmin(email, password);
    
    if (result.success) {
      navigate('admin-dashboard');
    } else {
      alert(result.message || 'Invalid admin credentials');
    }
  };

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <div className="form-card" style={{ maxWidth: '520px', margin: 'auto' }}>
        <h3>Administrator Login</h3>
        <p className="small">
          Demo admin: <strong>admin@votenow</strong> / <strong>admin123</strong>
        </p>
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
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;