import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import { Eye, EyeOff, Lock } from 'lucide-react';

// 1. PINDAHKAN KE LUAR agar fokus input tidak hilang
const PasswordInput = ({ placeholder, value, onChange, isVisible, toggleVisibility }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dapur-orange transition-colors">
      <Lock size={18} />
    </div>
    <input
      type={isVisible ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      className="w-full p-4 pl-12 pr-12 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange transition-all"
      onChange={onChange}
      required
    />
    <button
      type="button"
      onClick={toggleVisibility}
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-gray-400 hover:text-gray-600 transition-colors"
    >
      {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
);

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return showToast("Konfirmasi password tidak cocok", "error");
    }

    try {
      setLoading(true);
      const res = await authService.changePassword(form);
      if (res.data.success) {
        showToast("Password berhasil diubah", "success");
        navigate('/profil');
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal mengubah password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-50 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight text-center">Ubah Password</h2>
        <p className="text-sm text-gray-400 mt-1">Gunakan kombinasi password yang kuat.</p>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-5">
        <PasswordInput
          placeholder="Password Saat Ini"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          isVisible={showCurrent}
          toggleVisibility={() => setShowCurrent(!showCurrent)}
        />

        <PasswordInput
          placeholder="Password Baru"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          isVisible={showNew}
          toggleVisibility={() => setShowNew(!showNew)}
        />

        <PasswordInput
          placeholder="Konfirmasi Password Baru"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          isVisible={showConfirm}
          toggleVisibility={() => setShowConfirm(!showConfirm)}
        />

        <div className="pt-4 flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="flex-1 py-4 rounded-2xl font-bold"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            loading={loading} 
            className="flex-[2] py-4 rounded-2xl bg-dapur-orange hover:bg-orange-600 font-bold shadow-lg shadow-orange-100"
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;