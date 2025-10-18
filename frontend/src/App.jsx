import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AppRouter from './router';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;