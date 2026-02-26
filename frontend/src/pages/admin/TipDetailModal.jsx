import React from 'react';
import Button from "../../components/common/Button";
import { Lightbulb, X, PlayCircle } from "lucide-react";

const TipDetailModal = ({ tip, onClose }) => {
  if (!tip) return null;

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : url;
  };

  const isYoutube = tip.media?.type === 'youtube';
  // Mengubah pengecekan agar lebih fleksibel (video atau upload)
  const isVideo = (tip.media?.type === 'video' || tip.media?.type === 'upload') && 
                  tip.media?.url?.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    /* py-10 memberikan jarak atas bawah pada layar */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 py-10 animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 my-auto max-h-fit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Preview Section */}
        <div className="relative w-full bg-black aspect-video flex items-center justify-center group">
          {isYoutube ? (
            <iframe
              src={getEmbedUrl(tip.media.url)}
              title={tip.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isVideo ? (
            <video 
              src={tip.media.url} 
              controls 
              className="w-full h-full object-contain"
              poster={tip.media.thumbnail}
            />
          ) : (
            <img 
              src={tip.media.url || tip.media.thumbnail} 
              className="w-full h-full object-cover" 
              alt={tip.title} 
            />
          )}

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Section */}
        <div className="p-8 overflow-y-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-orange-100 p-3 rounded-2xl text-dapur-orange shrink-0">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-tight">
                {tip.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                  {tip.media?.type || 'Tips'}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-400 font-medium">
                  Dilihat {tip.views || 0} kali
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {tip.likesCount || 0} like
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line font-medium">
              {tip.description}
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 py-4 rounded-2xl font-bold order-2 sm:order-1">
              Tutup
            </Button>
            {isYoutube && (
              <a 
                href={tip.media.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all text-sm shadow-lg shadow-red-100 py-4 flex-1 order-1 sm:order-2"
              >
                <PlayCircle size={18} />
                Tonton di YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipDetailModal;