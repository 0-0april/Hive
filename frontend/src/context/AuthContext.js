import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { saveUser, getUser, removeUser } from '../utils/storage';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await getUser();
      if (userData && userData.token) {
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        setCurrentUser(userData.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (emailOrMobile, password) => {
    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('API URL:', API_URL);
      console.log('Email/Mobile:', emailOrMobile);
      console.log('Password length:', password?.length);

      const response = await axios.post(`${API_URL}/auth/login`, {
        emailOrMobile,
        password
      });

      console.log('Login response received:', response.status);
      const { token, user } = response.data;
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Save to storage
      await saveUser({ token, user });
      
      setCurrentUser(user);
      console.log('Login successful for user:', user.username);
      return { success: true };
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('API URL used:', API_URL);
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // Sign up function
  const signup = async (fullName, username, email, mobileNumber, password) => {
    try {
      console.log('=== SIGNUP ATTEMPT ===');
      console.log('API URL:', API_URL);
      console.log('Data:', { fullName, username, email, mobileNumber, passwordLength: password?.length });

      const response = await axios.post(`${API_URL}/auth/signup`, {
        fullName,
        username,
        email,
        mobileNumber,
        password
      });

      console.log('Signup response:', response.status, response.data);
      return { success: true, message: response.data.message || 'Registered successfully' };
    } catch (error) {
      console.error('=== SIGNUP ERROR ===');
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('API URL used:', API_URL);
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setCurrentUser(null);
      delete axios.defaults.headers.common['Authorization'];
      await removeUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, updates);
      
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      
      // Update storage with new user data
      const userData = await getUser();
      await saveUser({ ...userData, user: updatedUser });
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      const message = error.response?.data?.error || 'Update failed. Please try again.';
      return { success: false, message };
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
