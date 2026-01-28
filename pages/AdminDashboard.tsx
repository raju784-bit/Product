
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Product, StoreSettings, User } from '../types';
import { supabase } from '../supabase';

interface AdminDashboardProps {
  products: Product[];
  settings: StoreSettings;
  admins: User[];
  updateProducts: (products: Product[]) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (settings: StoreSettings) => void;
  deleteCategory: (name: string) => void;
  updateAdmins: (admins: User[]) => void;
  updateAuth: (username: string) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  currentUser: string | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  settings, 
  admins,
  updateProducts, 
  deleteProduct,
  updateSettings,
  deleteCategory,
  updateAdmins,
  updateAuth,
  showToast,
  currentUser
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-4 bg-indigo-50 border-b border-indigo-100">
              <h3 className="font-bold text-indigo-800">Management</h3>
              <p className="text-xs text-indigo-400">Logged in as {currentUser}</p>
            </div>
            <div className="p-2 space-y-1">
              <Link to="/admin" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition">
                Product List
              </Link>
              <Link to="/admin/add" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition">
                Add New Product
              </Link>
              <Link to="/admin/categories" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition">
                Manage Categories
              </Link>
              <Link to="/admin/settings" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition">
                Store Settings
              </Link>
              <Link to="/admin/accounts" className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition">
                Admin Accounts
              </Link>
            </div>
          </nav>
        </div>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<ProductList products={products} settings={settings} deleteProduct={deleteProduct} showToast={showToast} />} />
            <Route path="/add" element={<ProductForm products={products} settings={settings} updateProducts={updateProducts} showToast={showToast} />} />
            <Route path="/edit/:id" element={<ProductForm products={products} settings={settings} updateProducts={updateProducts} showToast={showToast} />} />
            <Route path="/settings" element={<SettingsForm settings={settings} updateSettings={updateSettings} showToast={showToast} />} />
            <Route path="/categories" element={<CategoryManager settings={settings} deleteCategory={deleteCategory} updateSettings={updateSettings} showToast={showToast} />} />
            <Route path="/accounts" element={<AdminList admins={admins} updateAdmins={updateAdmins} updateAuth={updateAuth} showToast={showToast} currentUser={currentUser} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Product List
// Fix: Corrected deleteProduct signature to match AdminDashboardProps and App.tsx
const ProductList: React.FC<{ products: Product[]; settings: StoreSettings; deleteProduct: (id: string) => void; showToast: any }> = ({ products, settings, deleteProduct, showToast }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Products ({products.length})</h2>
        <Link to="/admin/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
          Add New
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Prices</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={product.imageUrls[0] || 'https://via.placeholder.com/50'} className="h-10 w-10 rounded-lg object-cover shadow-sm" alt="" />
                    <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-indigo-600">{settings.currencySymbol}{product.discountPrice || product.price}</span>
                    {product.discountPrice && product.discountPrice < product.price && (
                      <span className="text-xs text-gray-400 line-through">{settings.currencySymbol}{product.price}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-right space-x-4">
                  <Link to={`/admin/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Edit</Link>
                  <button 
                    type="button"
                    // Fix: Corrected call to deleteProduct with only ID
                    onClick={() => deleteProduct(product.id)} 
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No products added yet. Click "Add New" to start.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-component: Product Form
const ProductForm: React.FC<{ products: Product[]; settings: StoreSettings; updateProducts: (p: Product[]) => void; showToast: any }> = ({ products, settings, updateProducts, showToast }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const existingProduct = products.find(p => p.id === id);

  const [formData, setFormData] = useState<Partial<Product>>(
    existingProduct || {
      name: '',
      price: 0,
      discountPrice: 0,
      category: settings.categories[0] || 'Other',
      description: '',
      imageUrls: [],
    }
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    if (files.length + (formData.imageUrls?.length || 0) > 5) {
      showToast('Maximum 5 images allowed', 'error');
      return;
    }

    setUploading(true);
    // Fix: Explicitly type 'file' as File to avoid 'unknown' type error in readAsDataURL
    const promises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...base64Images]
      }));
      setUploading(false);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrls?.length) {
      showToast('Please upload at least one image', 'error');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = { 
        ...formData, 
        discountPrice: formData.discountPrice && formData.discountPrice > 0 ? formData.discountPrice : null,
        updatedAt: new Date().toISOString()
      };

      if (isEdit) {
        const { error } = await supabase
          .from('products')
          .update(dataToSave)
          .eq('id', id);
        
        if (error) throw error;
        
        const updated = products.map(p => p.id === id ? { ...p, ...dataToSave } as Product : p);
        updateProducts(updated);
        showToast('Product updated successfully', 'success');
      } else {
        const newId = Math.random().toString(36).substr(2, 9);
        const { error } = await supabase
          .from('products')
          .insert([{ ...dataToSave, id: newId, createdAt: new Date().toISOString() }]);
        
        if (error) throw error;
        
        updateProducts([{ ...dataToSave, id: newId, createdAt: new Date().toISOString() } as Product, ...products]);
        showToast('Product added successfully', 'success');
      }
      navigate('/admin');
    } catch (error: any) {
      console.error('Save error:', error);
      showToast('Error saving product to database', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ({settings.currencySymbol})</label>
            <input type="number" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (Optional)</label>
            <input type="number" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.discountPrice || ''} placeholder="Leave empty for no discount" onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {settings.categories.map(c => <option key={c} value={c}>{c}</option>)}
              {!settings.categories.includes(formData.category || '') && <option value={formData.category}>{formData.category}</option>}
            </select>
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (1-5 images)</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {formData.imageUrls?.map((url, idx) => (
                <div key={idx} className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-50">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                </div>
              ))}
              {(formData.imageUrls?.length || 0) < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                  <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            {uploading && <p className="text-xs text-indigo-600 animate-pulse">Processing images...</p>}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={() => navigate('/admin')} className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition" disabled={saving}>Cancel</button>
          <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg flex items-center" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Sub-component: Settings Form
const SettingsForm: React.FC<{ settings: StoreSettings; updateSettings: (s: StoreSettings) => void; showToast: any }> = ({ settings, updateSettings, showToast }) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6">Store Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
          <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.storeName} onChange={e => setFormData({ ...formData, storeName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
          <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.whatsappNumber} onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
          <input type="url" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.facebookUrl} onChange={e => setFormData({ ...formData, facebookUrl: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
          <input type="url" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.instagramUrl} onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })} />
        </div>
        <button type="submit" className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg">Save Settings</button>
      </form>
    </div>
  );
};

// Sub-component: Category Manager
const CategoryManager: React.FC<{ settings: StoreSettings; deleteCategory: (name: string) => void; updateSettings: (s: StoreSettings) => void; showToast: any }> = ({ settings, deleteCategory, updateSettings, showToast }) => {
  const [newCat, setNewCat] = useState('');

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    if (settings.categories.includes(newCat.trim())) {
      showToast('Category already exists', 'error');
      return;
    }
    const updatedCategories = [...settings.categories, newCat.trim()];
    updateSettings({ ...settings, categories: updatedCategories });
    setNewCat('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
        <form onSubmit={addCategory} className="flex gap-4">
          <input 
            type="text" 
            placeholder="New Category Name" 
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Existing Categories</h2>
        </div>
        <ul className="divide-y divide-gray-50">
          {settings.categories.map(cat => (
            <li key={cat} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition">
              <span className="font-medium text-gray-700">{cat}</span>
              <button 
                type="button"
                onClick={() => deleteCategory(cat)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Remove
              </button>
            </li>
          ))}
          {settings.categories.length === 0 && (
            <li className="px-6 py-12 text-center text-gray-400">No categories defined.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

// Sub-component: Admin List
const AdminList: React.FC<{ admins: User[]; updateAdmins: (a: User[]) => void; updateAuth: any; showToast: any; currentUser: string | null }> = ({ admins, updateAdmins, updateAuth, showToast, currentUser }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (admins.some(a => a.username.toLowerCase() === newUsername.toLowerCase())) {
      showToast('Username already exists', 'error');
      return;
    }
    
    const newAdmin: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUsername,
      email: newEmail,
      password: newPassword,
      role: 'admin'
    };

    try {
      const { error } = await supabase.from('users').insert([newAdmin]);
      if (error) throw error;
      
      updateAdmins([...admins, newAdmin]);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      showToast('Admin added successfully to database', 'success');
    } catch (error: any) {
      showToast('Failed to add admin', 'error');
    }
  };

  const startEditing = (admin: User) => {
    setEditingId(admin.id);
    setEditUsername(admin.username);
    setEditEmail(admin.email);
    setEditPassword(admin.password);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    
    const isEditingSelf = admins.find(a => a.id === editingId)?.username === currentUser;
    
    try {
      const updatedData = { username: editUsername, email: editEmail, password: editPassword };
      const { error } = await supabase.from('users').update(updatedData).eq('id', editingId);
      if (error) throw error;

      const updatedAdmins = admins.map(a => a.id === editingId ? { ...a, ...updatedData } : a);
      updateAdmins(updatedAdmins);
      
      if (isEditingSelf) {
        updateAuth(editUsername);
      }
      
      setEditingId(null);
      showToast('Account updated in database', 'success');
    } catch (error: any) {
      showToast('Update failed', 'error');
    }
  };

  const handleDeleteAdmin = async (id: string, username: string) => {
    if (username === currentUser) {
      showToast('You cannot delete your own account', 'error');
      return;
    }
    if (admins.length <= 1) {
      showToast('At least one admin must exist', 'error');
      return;
    }
    if (window.confirm(`Delete admin "${username}"?`)) {
      try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
        
        updateAdmins(admins.filter(a => a.id !== id));
        showToast('Admin deleted from database', 'success');
      } catch (error: any) {
        showToast('Delete failed', 'error');
      }
    }
  };

  return (
    <div className="space-y-8">
      {editingId && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-indigo-900">Edit Admin Account</h2>
          <form onSubmit={handleUpdateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Username" 
              required 
              className="px-4 py-2 rounded-lg border border-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500" 
              value={editUsername} 
              onChange={e => setEditUsername(e.target.value)} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              required 
              className="px-4 py-2 rounded-lg border border-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500" 
              value={editEmail} 
              onChange={e => setEditEmail(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Password" 
              required 
              className="px-4 py-2 rounded-lg border border-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500" 
              value={editPassword} 
              onChange={e => setEditPassword(e.target.value)} 
            />
            <div className="flex space-x-2 md:col-span-1">
              <button type="submit" className="flex-grow bg-indigo-600 text-white font-bold rounded-lg py-2 hover:bg-indigo-700 transition">
                Update
              </button>
              <button type="button" onClick={() => setEditingId(null)} className="px-4 bg-gray-200 text-gray-700 font-bold rounded-lg py-2 hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-6">Add New Admin</h2>
        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" placeholder="Username" required className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
          <input type="email" placeholder="Email Address" required className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <button type="submit" className="bg-indigo-600 text-white font-bold rounded-lg py-2 hover:bg-indigo-700 transition shadow-lg">
            Add Admin
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Registered Admins</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map(admin => (
                <tr key={admin.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {admin.username} {admin.username === currentUser && <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">You</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button type="button" onClick={() => startEditing(admin)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Edit</button>
                    <button type="button" onClick={() => handleDeleteAdmin(admin.id, admin.username)} className={`text-red-600 hover:text-red-800 font-medium text-sm ${admin.username === currentUser ? 'opacity-30 cursor-not-allowed' : ''}`} disabled={admin.username === currentUser}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
