import React from 'react';
import Button from '../../components/common/Button';

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  // Fungsi untuk mencegah klik di dalam modal menutup modal secara tidak sengaja
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose} // Klik di luar modal (overlay) akan menutup modal
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={handleModalContentClick} // Mencegah klik di dalam modal memicu onClose overlay
      >
        {/* Header Dekoratif */}
        <div className="h-24 bg-dapur-orange relative" />

        <div className="px-6 pb-8 text-center">
          {/* Avatar Lingkaran */}
          <div className="w-20 h-20 bg-white border-4 border-white rounded-full mx-auto -mt-10 flex items-center justify-center shadow-lg text-2xl font-black text-dapur-orange uppercase relative z-10">
            {user.name ? user.name.charAt(0) : '?'}
          </div>

          <h3 className="mt-4 text-xl font-black text-gray-800 tracking-tight">{user.name}</h3>
          <p className="text-gray-500 text-sm font-medium">{user.email}</p>
          
          {/* Info Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="text-left">
              <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest">Role Status</p>
              <p className={`font-bold text-xs uppercase mt-1 ${
                user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
              }`}>
                {user.role}
              </p>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest">User ID</p>
              <p className="font-mono text-[10px] text-gray-400 mt-1 truncate" title={user._id}>
                {user._id}
              </p>
            </div>
          </div>
          
          {/* Tombol Close */}
          <div className="mt-8 relative z-20"> {/* Tambahkan Z-Index agar di atas elemen lain */}
            <Button 
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }} 
              className="w-full relative cursor-pointer" 
              variant="outline"
            >
              Close Detail
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;