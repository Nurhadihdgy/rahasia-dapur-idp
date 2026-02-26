// EditUserModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { userService } from '../../api/userService';
import { useToast } from '../../context/ToastContext'; // Tambahkan toast untuk feedback
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// Terima props 'user' yang berisi data dari baris yang diklik
const EditUserModal = ({ user, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Inisialisasi state LANGSUNG dari data user props
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '', // Password biasanya dikosongkan kecuali ingin diubah
    role: user?.role || 'user'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hanya kirim password jika diisi
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      // Gunakan ID user untuk update
      await userService.update(user._id, payload); 
      
      showToast("User berhasil diperbarui", "success");
      onSuccess(); // Refresh data di tabel
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal memperbarui user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Edit Admin / User</h2>
          <button onClick={onClose} className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <Input 
            label="Full Name" 
            placeholder="Admin Name" 
            value={form.name} // Gunakan value agar field terisi
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
          />
          
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="email@gmail.com" 
            value={form.email} // Gunakan value agar field terisi
            onChange={e => setForm({...form, email: e.target.value})} 
            required 
          />

          <Input 
            label="New Password (Optional)" 
            type="password" 
            placeholder="Kosongkan jika tidak ingin ganti"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Role</label>
            <select 
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange transition-all appearance-none cursor-pointer"
              value={form.role} // Ini akan otomatis memilih opsi sesuai data role di database
              onChange={e => setForm({...form, role: e.target.value})}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={loading} 
              className="flex-1"
            >
              Update User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;