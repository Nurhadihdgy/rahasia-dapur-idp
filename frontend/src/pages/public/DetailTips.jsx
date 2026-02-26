import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Eye, User, Calendar, Lightbulb, ArrowLeft, PlayCircle } from 'lucide-react';
import { tipsService } from '../../api/tipsService';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const DetailTips = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthContext();
  const { showToast } = useToast();
  
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await tipsService.getById(id);
        if (res.data && res.data.success) {
          const data = res.data.data;
          setTip(data);
          setLikesCount(data.likesCount || 0);
          // Cek status like berdasarkan array likes dari backend
          setIsLiked(data.likes?.includes(user?._id)); 
        }
      } catch (err) {
        showToast("Gagal memuat tips", "error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id, user?._id, showToast]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      showToast("Silakan login untuk menyukai tips ini", "error");
      return;
    }

    const prevIsLiked = isLiked;
    const prevCount = likesCount;

    try {
      // Optimistic Update
      setIsLiked(!prevIsLiked);
      setLikesCount(prev => prevIsLiked ? prev - 1 : prev + 1);
      
      await tipsService.toggleLike(id);
    } catch (err) {
      setIsLiked(prevIsLiked);
      setLikesCount(prevCount);
      showToast("Gagal memproses like", "error");
    }
  };

  // Helper untuk render media yang fleksibel
  const renderMedia = () => {
    const media = tip.media;
    if (!media) return null;

    if (media.type === 'youtube') {
      return (
        <iframe 
          src={media.url} 
          title={tip.title} 
          className="w-full h-full border-none" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    if (media.type === 'video') {
      return (
        <video 
          src={media.url} 
          poster={media.thumbnail} 
          controls 
          className="w-full h-full object-contain bg-black"
        />
      );
    }

    return (
      <img 
        src={media.url} 
        className="w-full h-full object-cover" 
        alt={tip.title} 
      />
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-pulse text-dapur-orange font-bold text-xl">
        Menyiapkan tips bermanfaat...
      </div>
    </div>
  );

  if (!tip) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Tips tidak ditemukan.
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Back Button */}
      <Link to="/tips" className="inline-flex items-center gap-2 text-gray-500 hover:text-dapur-orange mb-6 md:mb-8 transition-colors font-medium">
        <ArrowLeft size={20} /> Kembali ke Tips
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* Konten Utama */}
        <div className="flex-1 space-y-8 md:space-y-12">
          
          {/* Media Player Container */}
          <div className="relative rounded-[32px] md:rounded-[50px] overflow-hidden shadow-2xl bg-black aspect-video w-full">
            {renderMedia()}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-orange-50 text-dapur-orange px-4 py-1.5 rounded-full text-xs font-bold border border-orange-100 flex items-center gap-2">
                <Lightbulb size={14} /> Edukasi Dapur
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Calendar size={14} />
                {new Date(tip.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight uppercase">
              {tip.title}
            </h1>
            
            <div className="bg-white p-6 md:p-10 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-dapur-orange opacity-20"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PlayCircle className="text-dapur-orange" size={24} /> Penjelasan Lengkap
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                {tip.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Sidebar - Sticky on Desktop */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-[#FDF6F0] p-8 md:p-10 rounded-[40px] sticky top-28 shadow-sm border border-orange-50 space-y-8">
            <h3 className="text-2xl font-black text-gray-900">Informasi</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Views Card */}
              <div className="bg-white p-5 rounded-3xl border border-orange-100 text-center shadow-sm">
                <Eye className="text-dapur-orange mx-auto mb-2" size={24} />
                <p className="text-[10px] uppercase font-bold text-gray-400">Dilihat</p>
                <p className="font-black text-gray-800 text-xl">{tip.views || 0}</p>
              </div>

              {/* Like Button Card */}
              <button 
                onClick={handleLike}
                className={`p-5 rounded-3xl border transition-all duration-300 group ${
                  isLiked 
                  ? 'bg-red-50 border-red-200 shadow-inner' 
                  : 'bg-white border-orange-100 hover:border-red-200'
                }`}
              >
                <Heart 
                  className={`mx-auto mb-2 transition-transform group-active:scale-125 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-300'}`} 
                  size={24} 
                />
                <p className="text-[10px] uppercase font-bold text-gray-400">Suka</p>
                <p className={`font-black text-xl ${isLiked ? 'text-red-600' : 'text-gray-800'}`}>
                  {likesCount}
                </p>
              </button>
            </div>

            {/* Author Section */}
            <div className="pt-8 border-t border-orange-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-dapur-orange rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <User size={28} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Diterbitkan Oleh</p>
                <p className="text-gray-800 font-black text-lg">{tip.createdBy?.name || 'Admin'}</p>
              </div>
            </div>

            {/* Motivation Quote */}
            <div className="p-6 bg-white rounded-[24px] border border-orange-100 italic text-gray-500 text-sm leading-relaxed shadow-inner">
              "Kunci masakan yang lezat dimulai dari teknik memotong yang benar."
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailTips;