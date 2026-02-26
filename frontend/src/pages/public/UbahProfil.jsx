import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../api/authService';
import Button from '../../components/common/Button';

const EditProfile = () => {
  const { user, setUser } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Memanggil API put /auth/profile
      const res = await authService.updateProfile(form);
      
      if (res.data.success) {
        // Update context agar nama di Navbar/Sidebar berubah
        setUser(res.data.data); 
        showToast("Profil berhasil diperbarui", "success");
        navigate('/profil');
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal memperbarui profil", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ubah Profil</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 uppercase mb-1">Nama Lengkap</label>
          <input
            className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-dapur-orange outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 uppercase mb-1">Email Address</label>
          <input
            type="email"
            className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-dapur-orange outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <Button type="submit" loading={loading} className="w-full py-4 rounded-2xl">
          Simpan Perubahan
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;