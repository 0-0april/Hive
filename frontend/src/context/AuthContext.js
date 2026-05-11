import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveUser, getUser, removeUser } from '../utils/storage';
import { initialMockUsers } from '../mock/data';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mockUsers, setMockUsers] = useState(initialMockUsers);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const user = await getUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      // Check against mock users
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        await saveUser(userWithoutPassword);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  // Sign up function
  const signup = async (fullName, username, email, password) => {
    try {
      // Check if username already exists
      const usernameExists = mockUsers.some((u) => u.username === username);
      if (usernameExists) {
        return { success: false, message: 'Username already taken' };
      }

      // Check if email already exists
      const emailExists = mockUsers.some((u) => u.email === email);
      if (emailExists) {
        return { success: false, message: 'Email already registered' };
      }

      // Create new user
      const newUser = {
        id: `u${Date.now()}`,
        fullName,
        username,
        email,
        password,
      };

      // Add to mock users
      setMockUsers([...mockUsers, newUser]);

      return { success: true, message: 'Registered successfully' };
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setCurrentUser(null);
      await removeUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      await saveUser(updatedUser);
      
      // Update in mock users list
      setMockUsers(mockUsers.map(u => 
        u.id === updatedUser.id ? { ...u, ...updates } : u
      ));
      
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Update failed' };
    }
  };

  const value = {
    currentUser,
    mockUsers,
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
