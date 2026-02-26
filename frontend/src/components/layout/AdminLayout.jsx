import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => (
  <div className="flex min-h-screen w-screen bg-white font-sans">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto">
        <Outlet />
      </div>
    </main>
  </div>
);
export default AdminLayout;