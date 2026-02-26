import React, { useEffect, useState, useMemo } from 'react'; // Tambah useState & useMemo
import { useTips } from '../../hooks/useTips';
import Button from '../../components/common/Button';
import { Search, Lightbulb } from 'lucide-react';
import heroBg from '../../assets/images/hero-bg.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
  const { tips, loading, fetchTips } = useTips();
  const [searchQuery, setSearchQuery] = useState(''); // State untuk input pencarian
  const [activeCategory, setActiveCategory] = useState('Semua'); // State untuk filter kategori

  useEffect(() => {
    fetchTips({ limit: 50 }); // Ambil data lebih banyak agar pencarian frontend maksimal
  }, [fetchTips]);

  const categories = ['Semua', 'Edukasi', 'Teknik Masak', 'Bahan Baku', 'Peralatan'];

  // LOGIKA PENCARIAN & FILTER (Client-side)
  const filteredTips = useMemo(() => {
    return tips.filter((tip) => {
      const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tip.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'Semua' || tip.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tips, searchQuery, activeCategory]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-b-[60px]">
        <img 
          src={heroBg}
          className="absolute inset-0 w-full h-[500px] object-cover brightness-50"
          alt="Hero Background"
        />
        <div className="relative z-10 text-center space-y-8 px-4 w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Selamat Datang di <span className="text-dapur-orange">Rahasia Dapur</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto font-medium">
            Temukan berbagai tips dan trik memasak yang berguna untuk dapur Anda.
          </p>
          
          {/* Search Bar Fungsional */}
          <div className="max-w-xl mx-auto relative group">
            <input 
              type="text"
              placeholder="Cari tips memasak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update state saat mengetik
              className="w-full bg-white py-5 px-8 pr-32 rounded-full border-none shadow-2xl focus:ring-4 focus:ring-orange-500/20 outline-none text-gray-700 text-lg transition-all"
            />
            <div className="absolute right-2 top-2">
              <Button className="rounded-full px-8 py-3 bg-dapur-orange hover:bg-orange-600 transition-colors">
                <Search size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Featured Tips */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2.5 rounded-full border transition-all font-bold text-sm ${
                activeCategory === cat 
                ? 'bg-dapur-orange text-white border-dapur-orange shadow-md' 
                : 'bg-white text-gray-600 border-gray-100 hover:bg-orange-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium animate-pulse">
            Memuat tips menarik untuk Anda...
          </div>
        ) : filteredTips.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search size={32} />
            </div>
            <p className="text-gray-500 font-medium">Oops! Tips "{searchQuery}" tidak ditemukan.</p>
            <Button variant="outline" onClick={() => {setSearchQuery(''); setActiveCategory('Semua');}}>
                Reset Pencarian
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredTips.slice(0, 8).map(tip => ( // Tampilkan maksimal 8 tips di home
              <Link 
                to={`/tips/${tip._id}`} 
                key={tip._id} 
                className="group bg-white rounded-[40px] p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-50 block"
              >
                <div className="overflow-hidden rounded-[32px] aspect-square mb-6 relative">
                  <img 
                    src={tip.media?.thumbnail || tip.thumbnail} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={tip.title} 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-dapur-orange shadow-sm">
                    <Lightbulb size={20} />
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <p className="text-dapur-orange text-[10px] font-black uppercase mb-1 tracking-widest">
                    {tip.category || 'Tips'}
                  </p>
                  <h3 className="text-lg font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-dapur-orange transition-colors">
                    {tip.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredTips.length > 0 && (
          <div className="flex justify-center pt-8">
            <Link to="/tips">
              <Button variant="outline" className="px-12 py-4 rounded-2xl font-bold hover:bg-gray-50">
                Lihat Semua Tips
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;