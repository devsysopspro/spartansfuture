const API_BASE = 'http://localhost:5000'; // Local development

async function fetchAPI(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
    },
    credentials: 'include'
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth services
export const authService = {
  login: (email, password) => fetchAPI('/api/auth/login', 'POST', { email, password }),
  signup: (userData) => fetchAPI('/api/auth/signup', 'POST', userData),
  getCurrentUser: () => fetchAPI('/api/auth/me')
};

// User services
export const userService = {
  getUser: (id) => fetchAPI(`/api/users/${id}`),
  getStudents: () => fetchAPI('/api/students')
};

// Mentorship services
export const mentorshipService = {
  requestMentorship: (mentorId, studentId) => 
    fetchAPI('/api/mentorship/request', 'POST', { mentorId, studentId })
};