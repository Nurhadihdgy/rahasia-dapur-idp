import React, { useState } from 'react'; // Wajib import useState
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Users, 
  Lightbulb, 
  LogOut 
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext'; // Import toast
import { authService } from '../../api/authService'; // Pastikan path import benar
import logo from "../../assets/images/logo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const { logout } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    setIsOpen(false);
    
    // Tampilkan toast loading atau langsung eksekusi
    try {
      // 1. Panggil API untuk hapus refresh token di Database 
      await authService.logout();
    } catch (error) {
      console.error("API Logout Error:", error);
      // Tetap lanjut ke pembersihan client-side meskipun internet mati
    } finally {
      // 2. Bersihkan State Global (Context)
      logout(); 
      
      // 3. Bersihkan sisa-sisa localStorage
      localStorage.clear(); 
      
      // 4. Feedback & Navigasi
      showToast("Berhasil keluar akun admin", "success");
      
      // Gunakan replace: true agar admin tidak bisa memencet tombol 'back' browser
      navigate('/admin', { replace: true });
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Recipes', path: '/admin/recipes', icon: <UtensilsCrossed size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Tips', path: '/admin/tips', icon: <Lightbulb size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-dapur-cream border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
        </div>
        <span className="font-bold text-xl text-gray-800">Rahasia Dapur</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-dapur-orange text-white shadow-lg shadow-orange-100' 
                : 'text-gray-500 hover:bg-orange-50 hover:text-dapur-orange'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t mb-4 border-gray-100">
        <button 
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 text-white hover:bg-black rounded-xl transition-all group"
        >
          <div className="p-3 rounded-lg transition-colors">
            <LogOut size={18} />
          </div>
          <span className="font-semibold">Keluar Panel</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;