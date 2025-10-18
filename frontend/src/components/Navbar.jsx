import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Stethoscope, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Features', href: '#features', current: location.hash === '#features' },
    { name: 'How It Works', href: '#how-it-works', current: location.hash === '#how-it-works' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'PATIENT': return '/patient';
      case 'DOCTOR': return '/doctor';
      case 'ADMIN': return '/admin';
      default: return '/';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'PATIENT': return <User size={18} />;
      case 'DOCTOR': return <Stethoscope size={18} />;
      case 'ADMIN': return <Shield size={18} />;
      default: return <User size={18} />;
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mr-2 shadow-md"
              >
                <span className="text-white font-bold text-lg">M</span>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                MediChain
              </span>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                    item.current
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-teal-600 transform origin-left transition-transform duration-300 ${
                    item.current ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  {getRoleIcon()}
                  <span>Dashboard</span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    item.current
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              
              {isAuthenticated ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigation.length * 0.1 }}
                  >
                    <Link
                      to={getDashboardLink()}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navigation.length + 1) * 0.1 }}
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigation.length * 0.1 }}
                  >
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navigation.length + 1) * 0.1 }}
                  >
                    <Link
                      to="/register"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:shadow-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;