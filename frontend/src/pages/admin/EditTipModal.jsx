import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Film } from 'lucide-react'; // Tambah icon Film
import { tipsService } from '../../api/tipsService';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const EditTipModal = ({ tip, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  
  const isYoutubeType = tip?.media?.type === 'youtube';

  const [previewUrl, setPreviewUrl] = useState(tip?.media?.thumbnail || tip?.media?.url || null);
  const [form, setForm] = useState({ 
    title: tip?.title || '', 
    description: tip?.description || '', 
    youtubeUrl: isYoutubeType ? tip?.media?.url : '' 
  });

  useEffect(() => {
    return () => { 
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl); 
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Fungsi Helper untuk cek apakah preview adalah video
  const isVideo = (url, file) => {
    if (file) return file.type.startsWith('video/');
    // Cek ekstensi jika ambil dari URL server (opsional, tergantung backend Anda)
    return url?.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    
    if (isYoutubeType || form.youtubeUrl) {
      formData.append('youtubeUrl', form.youtubeUrl);
    }
    
    if (mediaFile) {
      formData.append('media', mediaFile);
    }

    try {
      await tipsService.update(tip._id, formData);
      showToast("Tips berhasil diperbarui", "success");
      onSuccess();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal memperbarui tips", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-black text-gray-800 italic uppercase tracking-tight">Edit Tips Memasak</h2>
          <button onClick={onClose} className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          <Input 
            label="Judul Tips" 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
            required 
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Deskripsi Tips</label>
            <textarea 
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange outline-none h-24 resize-none transition-all"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
            />
          </div>

          <Input 
            label="YouTube Video URL" 
            value={form.youtubeUrl} 
            placeholder="https://www.youtube.com/embed/..." 
            onChange={e => setForm({...form, youtubeUrl: e.target.value})} 
          />

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {isYoutubeType ? "Thumbnail YouTube (Ganti jika perlu)" : "Media Tips (Gambar/Video)"}
            </label>
            <div className={`border-2 border-dashed rounded-3xl p-4 bg-gray-50 flex flex-col items-center justify-center min-h-[200px] transition-all ${previewUrl ? 'border-orange-300' : 'border-gray-200'}`}>
              {previewUrl ? (
                <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-black flex items-center justify-center">
                  {/* LOGIKA PREVIEW GAMBAR VS VIDEO */}
                  {isVideo(previewUrl, mediaFile) ? (
                    <video 
                      src={previewUrl} 
                      className="max-h-[300px] w-full object-contain" 
                      controls
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      className="max-h-[300px] w-full object-contain" 
                      alt="Preview" 
                    />
                  )}
                  
                  <button 
                    type="button" 
                    onClick={() => {setPreviewUrl(null); setMediaFile(null)}} 
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                  >
                    <X size={16}/>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-3 cursor-pointer py-10 w-full text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <Film size={30} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-600 font-bold block">Pilih Media Baru</span>
                    <span className="text-xs text-gray-400 font-medium px-4 block">Mendukung format gambar atau video (MP4, MOV)</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" type="button">Batal</Button>
            <Button type="submit" loading={loading} className="flex-1 shadow-lg shadow-orange-100 font-bold">Update Tips</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTipModal;