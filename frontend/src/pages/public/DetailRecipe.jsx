import { useParams } from 'react-router-dom';
import { CheckCircle2, UtensilsCrossed, Flame, Globe, PlayCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { recipeService } from '../../api/recipeService';
import { useToast } from '../../context/ToastContext';

const DetailRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await recipeService.getById(id);
        
        // Menyesuaikan dengan struktur data langsung res.data
        if (res.data) {
          setRecipe(res.data);
        } else {
          setRecipe(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        showToast("Gagal memuat detail resep", "error");
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, showToast]);

  // Fungsi helper untuk merender media berdasarkan tipenya
  const renderMedia = () => {
    const { type, url, thumbnail } = recipe.media || {};

    switch (type) {
      case 'youtube':
        // Mengonversi URL YouTube biasa ke format embed jika diperlukan
        const embedUrl = url.replace("watch?v=", "embed/");
        return (
          <iframe
            src={embedUrl}
            title={recipe.title}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      case 'video':
        return (
          <video 
            key={url}
            src={url} 
            poster={thumbnail}
            controls 
            className="w-full h-full object-contain"
          />
        );
      case 'image':
      default:
        return (
          <img 
            src={url} 
            className="w-full h-full object-cover" 
            alt={recipe.title} 
          />
        );
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-dapur-orange animate-pulse">Menyiapkan bahan-bahan lezat...</div>;
  
  if (!recipe) return (
    <div className="p-20 text-center text-gray-500">
      <p>Resep tidak ditemukan.</p>
      <button onClick={() => window.location.reload()} className="mt-4 text-dapur-orange underline">Coba lagi</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* KOLOM KIRI: Konten Utama */}
        <div className="flex-1 space-y-12">
          {/* Section Media Dinamis */}
          <div className="relative rounded-[40px] overflow-hidden shadow-2xl bg-black aspect-video lg:h-[550px]">
            {renderMedia()}
            
            {/* Overlay Info minimalis di atas media */}
            <div className="ms-4 mb-3 absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg flex gap-6 text-sm pointer-events-auto">
                <div className="flex flex-col border-r border-gray-200 pr-6">
                  <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Dilihat</span>
                  <span className="font-bold text-gray-800">{recipe.views || 0} Kali</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Kategori</span>
                  <span className="font-bold text-gray-800 uppercase">{recipe.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Judul & Deskripsi */}
          <div className="space-y-4 px-2">
            <div className="flex items-center gap-3">
               <span className="bg-orange-50 text-dapur-orange px-4 py-1.5 rounded-full text-xs font-bold border border-orange-100">
                 Resep oleh {recipe.createdBy?.name || 'Admin'}
               </span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">{recipe.title}</h1>
            <p className="text-gray-500 leading-relaxed text-xl max-w-3xl">{recipe.description}</p>
          </div>

          {/* Langkah Masak */}
          <div className="space-y-8 pt-4 px-2">
            <h3 className="text-2xl font-bold flex items-center gap-4 text-gray-800">
              <UtensilsCrossed className="text-dapur-orange" size={28}/> 
              <span>Langkah Memasak</span>
            </h3>
            <div className="space-y-8">
              {recipe.steps?.map((step, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white border-2 border-orange-100 text-dapur-orange rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-dapur-orange group-hover:text-white group-hover:border-dapur-orange transition-all duration-300">
                      {idx + 1}
                    </div>
                    {idx !== recipe.steps.length - 1 && <div className="w-0.5 h-full bg-orange-50 my-2" />}
                  </div>
                  <div className="pb-8">
                    <p className="text-gray-700 text-lg leading-relaxed pt-1">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Bahan Utama */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-[#FDF6F0] p-8 md:p-10 rounded-[40px] sticky top-28 shadow-sm border border-orange-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Flame className="text-dapur-orange" fill="currentColor" /> Bahan
              </h3>
              <span className="text-xs font-bold bg-white text-gray-400 px-3 mx-3 py-1 rounded-lg border border-orange-100">
                {recipe.ingredients?.length || 0} Items
              </span>
            </div>

            <ul className="space-y-5">
              {recipe.ingredients?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white transition-colors duration-200 group">
                  <div className="mt-1">
                    <CheckCircle2 className="text-orange-200 group-hover:text-dapur-orange transition-colors" size={22} />
                  </div>
                  <span className="text-gray-700 font-medium text-lg leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-orange-100">
              <div className="flex items-center gap-4 text-gray-400">
                <Globe size={20} className="text-orange-200" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Asal Masakan</p>
                  <p className="text-gray-800 font-bold">{recipe.origin || 'Nusantara'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailRecipe;