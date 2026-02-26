import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Users, UtensilsCrossed, Lightbulb, Activity, Filter, Calendar } from 'lucide-react';
import DataTable from '../../components/shared/DataTable';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axiosInstance.get('/dashboard').then(res => setData(res.data.data));
  }, []);

  const stats = [
    { label: 'Total Users', value: data?.totals?.totalUsers, icon: <Users />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Recipes', value: data?.totals?.totalRecipes, icon: <UtensilsCrossed />, color: 'bg-orange-50 text-dapur-orange' },
    { label: 'Total Tips', value: data?.totals?.totalTips, icon: <Lightbulb />, color: 'bg-yellow-50 text-yellow-600' },
  ];

  // Logic Filter
  const filteredActivity = useMemo(() => {
    if (!data?.recentActivity) return [];
    if (filterType === 'ALL') return data.recentActivity;
    return data.recentActivity.filter(act => act.type === filterType);
  }, [data, filterType]);

  // Logic Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActivity.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredActivity.length / itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{s.label}</p>
              <h3 className="text-3xl font-black text-gray-800">{s.value || 0}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Activity size={24} className="text-dapur-orange" /> 
            Recent Activity
          </h3>

          {/* Filter Tabs */}
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {['ALL', 'USER', 'RECIPE', 'TIPS'].map((type) => (
              <button
                key={type}
                onClick={() => { setFilterType(type); setCurrentPage(1); }}
                className={`px-4 py-1.5 mx-2 bg-dapur-orange text-black rounded-xl text-xs font-bold transition-all ${
                  filterType === type 
                  ? 'bg-white text-dapur-orange shadow-sm' 
                  : 'text-white hover:text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden border border-gray-50 rounded-2xl">
          <DataTable headers={['Executor', 'Target Data', 'Action', 'Timestamp']}>
            {currentItems.length > 0 ? currentItems.map((act) => (
              <tr key={act._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-dapur-orange">
                      {act.description.includes('Admin') ? 'AD' : 'USR'}
                    </div>
                    <span className="font-bold text-gray-700 text-sm">System Admin</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">
                      {act.description}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      ID: {act.referenceId.slice(-6)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${
                    act.action.includes('CREATE') ? 'bg-green-50 text-green-600' :
                    act.action.includes('UPDATE') ? 'bg-blue-50 text-blue-600' :
                    act.action.includes('DELETE') ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {act.action.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">
                      {new Date(act.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • 
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">No activity found for this type.</td>
              </tr>
            )}
          </DataTable>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-gray-400 font-medium">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredActivity.length)} of {filteredActivity.length} activities
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-xl border bg-dapur-orange border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-all"
            >
              <Filter size={16} className="rotate-90" />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-xl border bg-dapur-orange border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-all"
            >
              <Filter size={16} className="-rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;