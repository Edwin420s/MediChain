import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import hederaService from '../services/hedera';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hederaAccount, setHederaAccount] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('medichain_token');
      const userData = localStorage.getItem('medichain_user');
      const hederaData = localStorage.getItem('medichain_hedera');

      if (token && userData) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(JSON.parse(userData));
        
        if (hederaData) {
          const hedera = JSON.parse(hederaData);
          setHederaAccount(hedera);
          // Connect to Hedera wallet
          await hederaService.connectWallet(hedera.accountId, hedera.privateKey);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { user: userData, token, hederaAccount } = response.data;
      
      localStorage.setItem('medichain_token', token);
      localStorage.setItem('medichain_user', JSON.stringify(userData));
      
      if (hederaAccount) {
        localStorage.setItem('medichain_hedera', JSON.stringify(hederaAccount));
        setHederaAccount(hederaAccount);
        await hederaService.connectWallet(hederaAccount.accountId, hederaAccount.privateKey);
      }
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { user: newUser, token, hederaAccount } = response.data;
      
      localStorage.setItem('medichain_token', token);
      localStorage.setItem('medichain_user', JSON.stringify(newUser));
      localStorage.setItem('medichain_hedera', JSON.stringify(hederaAccount));
      
      setUser(newUser);
      setHederaAccount(hederaAccount);
      await hederaService.connectWallet(hederaAccount.accountId, hederaAccount.privateKey);
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('medichain_token');
    localStorage.removeItem('medichain_user');
    localStorage.removeItem('medichain_hedera');
    
    delete api.defaults.headers.Authorization;
    setUser(null);
    setHederaAccount(null);
  };

  const value = {
    user,
    hederaAccount,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};