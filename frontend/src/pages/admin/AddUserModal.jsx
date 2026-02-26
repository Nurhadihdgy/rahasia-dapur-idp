import React, { useState } from 'react';
import { X, UserPlus, Shield, Eye, EyeOff } from 'lucide-react'; // Tambahkan Eye dan EyeOff
import { userService } from '../../api/userService';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const AddUserModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // State untuk toggle visibilitas password
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return showToast("Password tidak cocok!", "error");
    }

    setLoading(true);
    try {
      await userService.create(form);
      showToast("User baru berhasil ditambahkan", "success");
      onSuccess();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menambah user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="space-y-1">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-dapur-orange mb-4">
              <UserPlus size={24} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Add New Admin</h2>
            <p className="text-sm text-gray-500">Berikan akses kelola panel kepada staf baru.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
          <div className="space-y-4">
            <Input 
              label="Full Name" 
              placeholder="Masukkan nama lengkap" 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
            
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="admin@rahasiadapur.com" 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Input Password dengan Toggle Mata */}
              <div className="relative">
                <Input 
                  label="Password" 
                  type={showPass ? "text" : "password"} 
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-[38px] bg-transparent text-gray-400 hover:text-dapur-orange transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Input Confirm Password dengan Toggle Mata */}
              <div className="relative">
                <Input 
                  label="Confirm" 
                  type={showConfirmPass ? "text" : "password"} 
                  placeholder="Konfirmasi"
                  value={form.confirmPassword}
                  onChange={e => setForm({...form, confirmPassword: e.target.value})} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-[38px] bg-transparent text-gray-400 hover:text-dapur-orange transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Role Access */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Shield size={14} className="text-dapur-orange" /> Role Akses
              </label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange transition-all appearance-none font-medium text-gray-700"
                  value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="user">Standard User (Limited)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 py-3 rounded-2xl font-bold" type="button">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;