
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoreSettings, AuthState } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  auth: AuthState;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ settings, auth, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-indigo-600 text-white px-2 py-1 rounded">PG</span>
              <span className="text-xl font-bold text-gray-900 tracking-tight">{settings.storeName}</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition">Home</Link>
            {auth.isLoggedIn ? (
              <>
                {auth.role === 'admin' && (
                  <Link to="/admin" className={`font-medium transition ${isAdminPath ? 'text-indigo-600 underline underline-offset-8 decoration-2' : 'text-gray-600 hover:text-indigo-600'}`}>
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-400">Hi, {auth.username}</span>
                  <button 
                    onClick={onLogout}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition text-sm font-bold"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition text-sm font-bold">
                Log in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-2 space-y-1">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Home</Link>
          {auth.isLoggedIn ? (
            <>
              {auth.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Admin Panel</Link>
              )}
              <button 
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-bold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-indigo-600 hover:bg-indigo-50">Log in</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
