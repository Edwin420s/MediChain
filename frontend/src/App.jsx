import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
import AppRouter from './router';
import './styles/globals.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <UserProvider>
          <AppRouter />
          <ToastContainer />
        </UserProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;