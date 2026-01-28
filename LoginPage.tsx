import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthState, User } from './types'; // Fixed import to be local

interface LoginPageProps {
  onLogin: (username: string, role: 'admin' | 'customer') => void;
  onRegister: (user: User) => void;
  auth: AuthState;
  users: User[];
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister, auth, users, showToast }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();

  if (auth.isLoggedIn) {
    return <Navigate to={auth.role === 'admin' ? "/admin" : "/"} replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUser = users.find(
      (u) => (u.username === username || u.email === username) && u.password === password
    );

    if (validUser) {
      onLogin(validUser.username, validUser.role);
      showToast('Successfully logged in!', 'success');
      navigate(validUser.role === 'admin' ? '/admin' : '/');
    } else {
      showToast('Invalid credentials. Check your username/email and password.', 'error');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      showToast('Username already taken', 'error');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showToast('Email already registered', 'error');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password,
      role: 'customer'
    };

    onRegister(newUser);
    setActiveTab('login');
    setUsername(newUser.username);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 pt-10 pb-6 px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-indigo-100 text-sm">
            {activeTab === 'login' 
              ? 'Login to access your account' 
              : 'Register to start shopping and save orders'}
          </p>
        </div>

        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-sm font-bold transition ${activeTab === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-sm font-bold transition ${activeTab === 'register' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg mt-2"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;