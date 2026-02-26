import React, { useEffect, useState, useMemo } from 'react'; // Tambah useState & useMemo
import { useTips } from '../../hooks/useTips';
import { Lightbulb, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicTips = () => {
  const { tips, fetchTips, loading } = useTips();
  const [searchTerm, setSearchTerm] = useState(''); // State untuk input pencarian

  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  // Logika Pencarian: Memfilter tips berdasarkan judul atau deskripsi secara real-time
  const filteredTips = useMemo(() => {
    return tips.filter((tip) =>
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tips, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12 animate-in fade-in duration-500">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Tips & <span className="text-dapur-orange">Trik Dapur</span>
          </h1>
          <p className="text-gray-500 font-medium">Kumpulan rahasia dapur untuk memasak lebih cerdas dan efisien.</p>
        </div>

        <div className="relative w-full max-w-md mx-auto md:mx-0 group">
          <input 
            type="text"
            placeholder="Cari tips atau trik..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update state saat mengetik
            className="w-full bg-[#F9F4F0] border-2 border-transparent py-4 px-12 rounded-[24px] focus:bg-white focus:border-dapur-orange focus:ring-4 focus:ring-orange-100 outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dapur-orange transition-colors" size={20} />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium italic animate-pulse">
          Menyiapkan tips bermanfaat untuk Anda...
        </div>
      ) : filteredTips.length === 0 ? (
        /* Empty Search Results */
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Maaf, tips "{searchTerm}" tidak ditemukan.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 text-dapur-orange font-bold hover:underline"
          >
            Tampilkan semua tips
          </button>
        </div>
      ) : (
        /* Grid Desain Card */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTips.map((tip) => (
            <Link 
              to={`/tips/${tip._id}`} 
              key={tip._id} 
              className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group block"
            >
              {/* Header Card dengan Image */}
              <div className="h-56 overflow-hidden relative bg-gray-100">
                <img 
                  src={tip.media?.thumbnail || tip.media?.url} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={tip.title} 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-sm text-dapur-orange">
                  <Lightbulb size={24} />
                </div>
              </div>

              {/* Content Card */}
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-black text-gray-800 leading-tight group-hover:text-dapur-orange transition-colors">
                  {tip.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed font-medium">
                  {tip.description}
                </p>
                
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-lg">
                    {tip.media?.type || 'Edukasi'}
                  </span>
                  
                  <div className="flex items-center gap-2 text-dapur-orange font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    Detail <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicTips;