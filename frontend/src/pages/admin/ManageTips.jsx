import React, { useEffect, useState, useMemo } from 'react';
import { useTips } from '../../hooks/useTips';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, Lightbulb, Eye, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import AddTipModal from './AddTipModal';
import EditTipModal from './EditTipModal';
import TipDetailModal from './TipDetailModal';

const ManageTips = () => {
  const { tips, loading, fetchTips, removeTip } = useTips();
  const { showToast } = useToast();
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);

  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  // Client-side Search Logic
  const filteredTips = useMemo(() => {
    return tips.filter(tip => 
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tips, searchTerm]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Hapus tips "${title}"?`)) {
      try {
        await removeTip(id);
        showToast("Tips berhasil dihapus", "success");
      } catch (err) {
        showToast("Gagal menghapus tips", "error");
      }
    }
  };

  return (
    <div className="space-y-0 animate-in fade-in duration-500">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Manage Tips</h1>
          <p className="text-gray-500 text-sm">Kelola semua konten tips memasak Anda di sini.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dapur-orange transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Cari tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl w-full md:w-64 outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange transition-all shadow-sm"
            />
          </div>
          
          <Button onClick={() => setIsAddOpen(true)} variant="primary" className="rounded-2xl shadow-lg shadow-orange-100">
            <Plus size={20} className="mr-2" /> Add Tip
          </Button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium">Memuat tips...</div>
        ) : filteredTips.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic font-medium">Tidak ada tips yang ditemukan.</p>
          </div>
        ) : (
          filteredTips.map((tip) => (
            <div key={tip._id} className="group bg-white p-4 rounded-[2rem] border border-gray-100 flex gap-5 items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              
              {/* Thumbnail Section */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner">
                {tip.media?.thumbnail || tip.media?.url ? (
                  <img 
                    src={tip.media.thumbnail || tip.media.url} 
                    alt={tip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-200">
                    <Lightbulb size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Text Section */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="inline-block px-3 py-1 bg-orange-50 text-dapur-orange text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {tip.media?.type || 'Tips'}
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-lg leading-tight truncate">{tip.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1 font-medium leading-relaxed">
                    {tip.description}
                  </p>
                </div>
                
                {/* Actions Section */}
                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={() => setSelectedTip(tip)} 
                    className="p-2.5 bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-dapur-orange rounded-xl transition-all shadow-sm"
                    title="Detail"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => setEditingTip(tip)} 
                    className="p-2.5 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all shadow-sm"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(tip._id, tip.title)} 
                    className="p-2.5 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all shadow-sm"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODALS */}
      {isAddOpen && <AddTipModal onClose={() => setIsAddOpen(false)} onSuccess={() => { setIsAddOpen(false); fetchTips(); }} />}
      {editingTip && <EditTipModal tip={editingTip} onClose={() => setEditingTip(null)} onSuccess={() => { setEditingTip(null); fetchTips(); }} />}
      {selectedTip && <TipDetailModal tip={selectedTip} onClose={() => setSelectedTip(null)} />}
    </div>
  );
};

export default ManageTips;