import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './router';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <AppRouter />
            </main>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;