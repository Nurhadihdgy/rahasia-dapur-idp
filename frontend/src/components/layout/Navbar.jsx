import { useState } from 'react'; // Tambahkan useState
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react'; // Tambahkan ikon
import Button from '../common/Button';
import Logo from "../../assets/images/logo.png";
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../api/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State untuk mobile menu
  const { isAuthenticated, user, logout } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleProtectedNavigation = (e, path) => {
    setIsOpen(false); // Tutup menu setelah klik
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      // Menjalankan request POST ke /api/auth/logout
      await authService.logout();
    } catch (error) {
      console.error("API Logout Error:", error);
    } finally {
      // Pembersihan Client-side tetap dijalankan baik API sukses maupun gagal
      logout(); 
      localStorage.clear(); // Cara cepat membersihkan semua sesi
      showToast("Berhasil keluar akun", "success");
      navigate('/');
    }
  };

  // Helper untuk class active NavLink
  const navLinkClass = ({ isActive }) => 
    `text-lg md:text-base font-semibold transition-colors ${
      isActive ? 'text-dapur-orange md:border-b-2 md:border-dapur-orange pb-1' : 'text-black hover:text-dapur-orange'
    }`;

  return (
    <nav className="w-full bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 z-50">
          <img src={Logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-xl text-gray-900 tracking-tight">Rahasia Dapur</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={navLinkClass}>Beranda</NavLink>
          <NavLink to="/recipes" onClick={(e) => handleProtectedNavigation(e, '/recipes')} className={navLinkClass}>Resep</NavLink>
          <NavLink to="/tips" className={navLinkClass}>Tips & Trik</NavLink>
        </div>

        {/* Desktop Auth & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/register"><Button variant="primary" className="px-8 rounded-2xl">Daftar</Button></Link>
                <Link to="/login"><Button variant="secondary" className="px-8 rounded-2xl">Masuk</Button></Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/profil">
                  <Button variant="secondary" className="px-6 rounded-2xl text-sm">
                    Hai, <span className="text-dapur-orange ml-1">{user?.name}</span>
                  </Button>
                </Link>
                <Button variant="danger" onClick={handleLogout} className="px-6 rounded-2xl text-sm">Logout</Button>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard"><Button variant="primary" className="px-4 py-2 text-xs rounded-xl">Admin</Button></Link>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Button (Hanya Mobile) */}
          <button 
            className="md:hidden p-2 bg-white text-gray-600 z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 flex flex-col p-8 pt-24 gap-8 transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <NavLink to="/" onClick={() => setIsOpen(false)} className={navLinkClass}>Beranda</NavLink>
        <NavLink to="/recipes" onClick={(e) => handleProtectedNavigation(e, '/recipes')} className={navLinkClass}>Resep</NavLink>
        <NavLink to="/tips" onClick={() => setIsOpen(false)} className={navLinkClass}>Tips & Trik</NavLink>
        
        <hr className="border-gray-100" />

        <div className="flex flex-col gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/register" onClick={() => setIsOpen(false)}><Button variant="primary" className="w-full py-4 rounded-2xl">Daftar</Button></Link>
              <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="secondary" className="w-full py-4 rounded-2xl">Masuk</Button></Link>
            </>
          ) : (
            <>
              <Link to="/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-gray-700 font-bold">
                <div className="bg-orange-50 p-2 rounded-full text-dapur-orange"><UserIcon size={20}/></div>
                Profil {user?.name}
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-dapur-orange font-bold">Panel Admin</Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-bold pt-4">
                <LogOut size={20} /> Keluar Akun
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;