// Add this to /src/services/auth.js
export const login = async (email, password) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, { // REPLACE with your actual Lambda URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  };
  
  export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, { // REPLACE with your actual Lambda URL
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // ... error handling
  };