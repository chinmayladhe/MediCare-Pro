import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await API.post('/auth/login', { username, password });
      const authData = response.data;
      
      const userData = {
        id: authData.id,
        username: authData.username,
        role: authData.role,
        firstName: authData.firstName,
        lastName: authData.lastName,
      };

      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please try again.';
    }
  };

  const registerPatient = async (patientData) => {
    try {
      const response = await API.post('/auth/register', patientData);
      const authData = response.data;

      const userData = {
        id: authData.id,
        username: authData.username,
        role: authData.role,
        firstName: authData.firstName,
        lastName: authData.lastName,
      };

      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.validationErrors || error.response?.data?.message || 'Registration failed.';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerPatient, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
