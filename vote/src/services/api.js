const API_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Voter API
export const voterAPI = {
  register: async (data) => {
    const response = await fetch(`${API_URL}/voters/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/voters/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/voters/profile`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Admin API
export const adminAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  verify: async () => {
    const response = await fetch(`${API_URL}/admin/verify`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Poll API
export const pollAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/polls`);
    return response.json();
  },

  getOne: async (id) => {
    const response = await fetch(`${API_URL}/polls/${id}`);
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/polls`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  vote: async (pollId, candidateName) => {
    const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ candidateName })
    });
    return response.json();
  },

  delete: async (pollId) => {
    const response = await fetch(`${API_URL}/polls/${pollId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/polls/stats/all`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};