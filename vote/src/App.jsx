import React from 'react';
import { useAppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VoterLogin from './pages/VoterLogin';
import VoterRegister from './pages/VoterRegister';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const { currentPage } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'voter-login':
        return <VoterLogin />;
      case 'voter-register':
        return <VoterRegister />;
      case 'vote':
        return <VotePage />;
      case 'results':
        return <ResultsPage />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <Header />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;