import React from 'react';
import { useAppContext } from '../context/AppContext';

function Header() {
  const { navigate, voter, admin, logoutVoter, logoutAdmin, currentPage } = useAppContext();

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <div className="brand" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
            Vote<span>Now</span>
          </div>
          <nav>
            <a onClick={() => navigate('home')}>Home</a>
            <a onClick={() => navigate('results')}>Results</a>
            {voter && (
              <>
                <a onClick={() => navigate('vote')}>Vote</a>
                <a onClick={logoutVoter}>Logout ({voter.name})</a>
              </>
            )}
            {admin && (
              <>
                <a onClick={() => navigate('admin-dashboard')}>Dashboard</a>
                <a onClick={logoutAdmin}>Logout (Admin)</a>
              </>
            )}
            {!voter && !admin && (
              <>
                <a onClick={() => navigate('voter-login')}>Login</a>
                <a onClick={() => navigate('admin-login')}>Admin</a>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;