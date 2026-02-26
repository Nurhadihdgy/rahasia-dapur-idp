import React from 'react';
import { X, ChefHat, PlayCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const RecipeDetailModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  // Helper untuk mendapatkan Embed URL YouTube
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : url;
  };

  const isYoutube = recipe.media?.type === 'youtube';
  const isVideo = (recipe.media?.type === 'video' || recipe.media?.type === 'upload') && 
                  recipe.media?.url?.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 py-10 animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Preview Section */}
        <div className="relative w-full bg-black aspect-video flex items-center justify-center">
          {isYoutube ? (
            <iframe
              src={getEmbedUrl(recipe.media.url)}
              title={recipe.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isVideo ? (
            <video 
              src={recipe.media.url} 
              controls 
              className="w-full h-full object-contain"
              poster={recipe.media.thumbnail}
            />
          ) : (
            <img 
              src={recipe.media.url || recipe.media.thumbnail} 
              className="w-full h-full object-cover" 
              alt={recipe.title} 
            />
          )}

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all z-10"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content Section */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black text-gray-800 leading-tight">{recipe.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <ChefHat size={16} className="text-dapur-orange" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {recipe.category}
                </span>
              </div>
            </div>
            {isYoutube && (
              <a 
                href={recipe.media.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
              >
                <PlayCircle size={16} /> YouTube
              </a>
            )}
          </div>
          
          <p className="text-gray-600 mb-8 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {recipe.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Bahan-bahan */}
            <div>
              <h3 className="font-black text-lg mb-4 border-l-4 border-dapur-orange pl-3 italic">Bahan-bahan</h3>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} className="text-gray-600 flex items-start gap-3 text-sm font-medium">
                    <div className="w-2 h-2 bg-orange-200 rounded-full mt-1.5 shrink-0" /> 
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Langkah-langkah */}
            <div>
              <h3 className="font-black text-lg mb-4 border-l-4 border-dapur-orange pl-3 italic">Langkah Memasak</h3>
              <ul className="space-y-5">
                {recipe.steps?.map((step, i) => (
                  <li key={i} className="text-gray-600 flex gap-4 text-sm leading-relaxed font-medium">
                    <span className="flex items-center justify-center w-6 h-6 bg-orange-100 text-dapur-orange rounded-lg text-xs font-black shrink-0">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <Button onClick={onClose} variant="outline" className="w-full py-4 rounded-2xl font-bold">
              Tutup Detail Resep
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;