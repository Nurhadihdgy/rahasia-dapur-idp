import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PublicLayout = () => (
  <div className="min-h-screen w-screen bg-[#FDFCFB]">
    <Navbar />
    <main>
      <Outlet /> {/* Halaman resep/tips akan muncul di sini */}
    </main>
    <footer className="py-10 text-center text-gray-400 text-sm">
      © 2026 Rahasia Dapur. Made with heart for cooking lovers.
    </footer>
  </div>
);
export default PublicLayout;