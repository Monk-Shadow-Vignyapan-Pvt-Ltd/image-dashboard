import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constant.js';
// import { Loader } from './Loader.jsx';
import { LoaderAnime } from './LoaderAnime.jsx';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token');
      if (token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }
      try {
        const tokenResponse = await axios.post(
          `${API_BASE_URL}/auth/tokenIsValid`,
          null,
          { headers: { 'x-auth-token': token } }
        );

        if (tokenResponse.data) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Ensure loading completes
      }
    };

    checkLoggedIn();
  }, []);

  // Render a loading indicator or nothing until the check is complete
  if (isLoading) {
    return <LoaderAnime /> // Or any loading spinner component
  }

  // Render children or navigate to login based on authentication status
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
