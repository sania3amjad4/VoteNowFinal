import React, { createContext, useContext, useState, useEffect } from 'react';
import { voterAPI, adminAPI, pollAPI } from '../services/api';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [voter, setVoter] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      const user = JSON.parse(userData);
      if (userType === 'voter') {
        setVoter(user);
      } else if (userType === 'admin') {
        setAdmin(user);
      }
    }

    fetchPolls();
  }, []);

  const navigate = (page) => setCurrentPage(page);

  // Fetch all polls
  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await pollAPI.getAll();
      if (Array.isArray(data)) {
        setPolls(data);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  // Register voter
  const registerVoter = async (data) => {
    try {
      setLoading(true);
      const response = await voterAPI.register(data);
      
      if (response.token) {
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Login voter
  const loginVoter = async (email, password) => {
    try {
      setLoading(true);
      const response = await voterAPI.login(email, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'voter');
        localStorage.setItem('userData', JSON.stringify(response));
        setVoter(response);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Login admin
  const loginAdmin = async (email, password) => {
    try {
      setLoading(true);
      const response = await adminAPI.login(email, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userData', JSON.stringify(response));
        setAdmin(response);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Create poll
  const createPoll = async (title, candidates) => {
    try {
      setLoading(true);
      const response = await pollAPI.create({ title, candidates });
      
      if (response._id) {
        await fetchPolls();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Cast vote
  const castVote = async (pollId, candidateName) => {
    try {
      setLoading(true);
      const response = await pollAPI.vote(pollId, candidateName);
      
      if (response.message === 'Vote cast successfully') {
        await fetchPolls();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete poll
  const deletePoll = async (pollId) => {
    try {
      setLoading(true);
      const response = await pollAPI.delete(pollId);
      
      if (response.message === 'Poll deleted successfully') {
        await fetchPolls();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout voter
  const logoutVoter = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    setVoter(null);
    navigate('home');
  };

  // Logout admin
  const logoutAdmin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    setAdmin(null);
    navigate('home');
  };

  const value = {
    currentPage,
    navigate,
    voter,
    admin,
    polls,
    loading,
    registerVoter,
    loginVoter,
    loginAdmin,
    createPoll,
    castVote,
    deletePoll,
    logoutVoter,
    logoutAdmin,
    fetchPolls
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}