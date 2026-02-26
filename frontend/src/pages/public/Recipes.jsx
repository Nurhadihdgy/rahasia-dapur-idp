import React, { useEffect, useState, useMemo } from 'react'; // Tambah useState & useMemo
import { useRecipes } from '../../hooks/useRecipes';
import { Utensils, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicRecipes = () => {
  const { recipes, loading, fetchRecipes } = useRecipes();
  const [searchTerm, setSearchTerm] = useState(''); // State untuk input pencarian

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Logika Pencarian: Memfilter resep berdasarkan judul atau kategori
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recipes, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12 animate-in fade-in duration-500">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Jelajahi <span className="text-dapur-orange">Resep Lezat</span>
          </h1>
          <p className="text-gray-500 font-medium">Temukan inspirasi memasak harian dengan bahan-bahan terbaik.</p>
        </div>

        <div className="relative w-full max-w-md mx-auto md:mx-0 group">
          <input 
            type="text"
            placeholder="Cari resep atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update state saat mengetik
            className="w-full bg-[#F9F4F0] border-2 border-transparent py-4 px-12 rounded-[24px] focus:bg-white focus:border-dapur-orange focus:ring-4 focus:ring-orange-100 outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dapur-orange transition-colors" size={20} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-bounce mb-4 text-dapur-orange flex justify-center">
            <Utensils size={40} />
          </div>
          <p className="text-gray-500 font-medium tracking-wide italic">Mencari resep terbaik untuk Anda...</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Oops! Resep "{searchTerm}" tidak ditemukan.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 text-dapur-orange font-bold hover:underline"
          >
            Lihat semua resep
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredRecipes.map((recipe) => (
            <Link 
              to={`/recipes/${recipe._id}`} 
              key={recipe._id} 
              className="bg-white rounded-[40px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group block"
            >
              {/* Image Section */}
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={recipe.media?.thumbnail || recipe.media?.url} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={recipe.title} 
                />
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm text-[10px] font-black text-dapur-orange uppercase tracking-[0.2em]">
                  {recipe.category}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-black text-gray-800 leading-tight group-hover:text-dapur-orange transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-medium">
                  {recipe.description || `Temukan cara memasak ${recipe.title} yang lezat dan mudah diikuti.`}
                </p>
                
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Waktu Masak</span>
                    <span className="text-sm font-bold text-gray-700">{recipe.media?.duration || '45'} Menit</span>
                  </div>
                  
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

export default PublicRecipes;