import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';

const Navbar = ({ cartItems = [] }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Nav items for DRY code
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/offer', label: 'Offer' },
    { path: '/about', label: 'About' },
    { path: '/cart', label: 'Cart', showBadge: true },
    { path: '/Hier', label: 'Hier' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2 border-b border-blue-100/80' : 'bg-white py-4 shadow-md border-b border-blue-100/80'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-slate-800 relative group"
        >
          KingHub
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <li key={item.path} className="relative">
              <Link
                to={item.path}
                className="font-medium transition duration-300 py-2 px-1 relative group"
              >
                <span className={`relative z-10 ${isActive(item.path) ? 'text-blue-800' : 'text-slate-700'}`}>
                  {item.label}
                </span>
                {isActive(item.path) ? (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-800"
                  />
                ) : (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-300 group-hover:w-full"></span>
                )}
              </Link>
              {item.showBadge && cartItems && cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-2 text-xs"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center">
          {!isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300 cursor-pointer"
              onClick={() => loginWithRedirect()}
            >
              Sign In
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300 cursor-pointer"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-slate-700 hover:text-blue-700 focus:outline-none transition duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-lg rounded-b-lg overflow-hidden"
        >
          <div className="px-4 py-4">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`block py-2 px-4 rounded-lg transition duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      {item.label}
                      {item.showBadge && cartItems && cartItems.length > 0 && (
                        <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {!isAuthenticated ? (
                <button
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
                  onClick={() => {
                    loginWithRedirect();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </button>
              ) : (
                <button
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
                  onClick={() => {
                    logout({ logoutParams: { returnTo: window.location.origin } });
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;