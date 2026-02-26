import React, { useEffect, useState, useMemo } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Trash2, Mail, Eye, Pencil, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import UserDetailModal from './UserDetailModal';

const ManageUsers = () => {
  const { users, loading, fetchUsers, removeUser } = useUsers();
  const { showToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fitur Pencarian Client-side
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus user "${name}"?`)) {
      try {
        await removeUser(id);
        showToast("User berhasil dihapus", "success");
      } catch (err) {
        showToast("Gagal menghapus user", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Manage Users</h1>
          <p className="text-sm text-gray-500">Kelola akses administrator dan pengguna aplikasi.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} variant="primary" className="shadow-lg shadow-orange-100">
          <UserPlus size={20} className="mr-2" /> Add Admin
        </Button>
      </div>

      {/* Search Bar Section - Memberikan jarak ekstra */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dapur-orange transition-colors" size={18} />
        <input 
          type="text"
          placeholder="Cari nama atau email user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange transition-all shadow-sm"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-20 text-gray-400 font-medium">Memuat data user...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-20 text-gray-400 italic">Tidak ada user ditemukan.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{user.name}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Mail size={12}/> {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setSelectedUser(user)} className="p-2.5 rounded-xl bg-orange-50 text-dapur-orange hover:bg-dapur-orange hover:text-white transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => setEditingUser(user)} className="p-2.5 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(user._id, user.name)} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {isAddOpen && <AddUserModal onClose={() => setIsAddOpen(false)} onSuccess={() => { setIsAddOpen(false); fetchUsers(); }} />}
      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSuccess={() => { setEditingUser(null); fetchUsers(); }} />}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default ManageUsers;