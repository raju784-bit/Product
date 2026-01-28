
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Product, StoreSettings, AuthState, User } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_USERS } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetails from './ProductDetails';
import LoginPage from './LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import Toast from './components/Toast';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem('pg_auth');
      return saved ? JSON.parse(saved) : { isLoggedIn: false, username: null, role: null };
    } catch {
      return { isLoggedIn: false, username: null, role: null };
    }
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loading, setLoading] = useState(true);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        // Parallel fetching to improve speed
        const [productsRes, settingsRes, usersRes] = await Promise.all([
          supabase.from('products').select('*').order('createdAt', { ascending: false }),
          supabase.from('settings').select('*').single(),
          supabase.from('users').select('*')
        ]);
        
        if (isMounted) {
          if (!productsRes.error && productsRes.data) setProducts(productsRes.data);
          if (!settingsRes.error && settingsRes.data) setSettings(settingsRes.data);
          if (!usersRes.error && usersRes.data) setUsers(usersRes.data);
        }
      } catch (error: any) {
        console.error('Initial fetch error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    
    return () => { isMounted = false; };
  }, []);

  const updateProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product deleted successfully', 'success');
    } catch (error: any) {
      showToast('Failed to delete product', 'error');
    }
  };

  const updateSettings = async (newSettings: StoreSettings) => {
    try {
      const { error } = await supabase.from('settings').upsert({ id: 1, ...newSettings });
      if (error) throw error;
      setSettings(newSettings);
      showToast('Settings updated', 'success');
    } catch (error: any) {
      showToast('Failed to update settings', 'error');
    }
  };

  const deleteCategory = (categoryName: string) => {
    const updatedCategories = settings.categories.filter(c => c !== categoryName);
    updateSettings({ ...settings, categories: updatedCategories });
  };

  const onRegister = async (newUser: User) => {
    try {
      const { error } = await supabase.from('users').insert([{ ...newUser, role: 'customer' }]);
      if (error) throw error;
      setUsers(prev => [...prev, { ...newUser, role: 'customer' }]);
      showToast('Registration successful!', 'success');
    } catch (error: any) {
      showToast('Registration failed', 'error');
    }
  };

  const login = (username: string, role: 'admin' | 'customer') => {
    const newAuth: AuthState = { isLoggedIn: true, username, role };
    setAuth(newAuth);
    localStorage.setItem('pg_auth', JSON.stringify(newAuth));
  };

  const logout = () => {
    const newAuth: AuthState = { isLoggedIn: false, username: null, role: null };
    setAuth(newAuth);
    localStorage.removeItem('pg_auth');
    showToast('Logged out', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xs">PG</span>
            </div>
          </div>
          <p className="mt-4 text-gray-500 font-medium animate-pulse">লোড হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar settings={settings} auth={auth} onLogout={logout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage products={products} settings={settings} />} />
            <Route path="/product/:id" element={<ProductDetails products={products} settings={settings} />} />
            <Route 
              path="/login" 
              element={
                <LoginPage 
                  onLogin={login} 
                  onRegister={onRegister} 
                  auth={auth} 
                  users={users} 
                  showToast={showToast} 
                />
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                auth.isLoggedIn && auth.role === 'admin' ? (
                  <AdminDashboard 
                    products={products} 
                    settings={settings} 
                    admins={users.filter(u => u.role === 'admin')}
                    updateProducts={updateProducts}
                    deleteProduct={deleteProduct}
                    updateSettings={updateSettings}
                    deleteCategory={deleteCategory}
                    updateAdmins={(newAdmins) => {
                      const otherUsers = users.filter(u => u.role !== 'admin');
                      setUsers([...otherUsers, ...newAdmins]);
                    }}
                    updateAuth={(username) => login(username, 'admin')}
                    showToast={showToast}
                    currentUser={auth.username}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer settings={settings} />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </Router>
  );
};

export default App;
