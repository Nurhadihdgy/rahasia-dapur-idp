import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { authService } from '../../api/authService'; 
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import axiosInstance from '../../api/axiosInstance';

const EditRecipeModal = ({ recipe, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Inisialisasi State dengan data yang sudah ada
  const [ingredients, setIngredients] = useState(recipe.ingredients || ['']);
  const [steps, setSteps] = useState(recipe.steps || ['']);
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(recipe.media?.thumbnail || null);

  const isYoutubeType = recipe?.media?.type === 'youtube';

  const [formData, setFormData] = useState({
    title: recipe.title || '',
    description: recipe.description || '',
    category: recipe.category || 'Main Course',
    youtubeUrl: isYoutubeType ? recipe.media.url : null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFieldChange = (index, value, setter) => {
    setter(prev => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('youtubeUrl', formData.youtubeUrl);
    
    ingredients.forEach((ing, i) => data.append(`ingredients[${i}]`, ing));
    steps.forEach((step, i) => data.append(`steps[${i}]`, step));
    
    // Hanya kirim file media jika admin mengganti foto
    if (mediaFile) data.append('media', mediaFile);

    try {
      // Menggunakan PATCH/PUT ke endpoint dengan ID resep
      await axiosInstance.put(`/recipe/${recipe._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast("Resep berhasil diperbarui", "success");
      onSuccess();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal memperbarui resep", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Edit Resep: {recipe.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 bg-[#FDFDFD]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Input 
                  label="Judul Resep" 
                  value={formData.title}
                  required 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
                
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Deskripsi</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 transition-all outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange h-32 resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Kategori</label>
                  <select 
                    className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 transition-all outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>

                <Input 
                  label="YouTube URL" 
                  value={formData.youtubeUrl}
                  onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} 
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">Ubah Thumbnail (Kosongkan jika tidak ingin diubah)</label>
                <div className="border-2 border-dashed rounded-3xl overflow-hidden flex flex-col items-center justify-center bg-white border-orange-200">
                    <div className="relative w-full h-64">
                      <img src={previewUrl} className="w-full h-full object-cover opacity-60" alt="Preview" />
                      <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-all">
                        <ImageIcon size={32} className="text-white mb-2" />
                        <span className="text-white text-sm font-bold">Klik untuk Ganti Gambar</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <label className="text-base font-black text-gray-800 block mb-4 border-l-4 border-dapur-orange pl-3 italic">Bahan-bahan</label>
                <div className="space-y-3">
                  {ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input 
                        value={ing} 
                        onChange={e => handleFieldChange(i, e.target.value, setIngredients)}
                      />
                      <button type="button" onClick={() => setIngredients(prev => prev.filter((_, idx) => idx !== i))} className="text-red-300 hover:text-red-500 mt-1">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setIngredients(prev => [...prev, ''])} className="flex items-center gap-2 text-sm text-dapur-orange font-bold mt-2">
                    <Plus size={16} /> Tambah Bahan
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <label className="text-base font-black text-gray-800 block mb-4 border-l-4 border-dapur-orange pl-3 italic">Langkah Memasak</label>
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="mt-3 font-bold text-orange-200">{i + 1}</span>
                      <textarea 
                        className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange h-20 resize-none" 
                        value={step} 
                        onChange={e => handleFieldChange(i, e.target.value, setSteps)}
                      />
                      <button type="button" onClick={() => setSteps(prev => prev.filter((_, idx) => idx !== i))} className="text-red-300 hover:text-red-500 mt-2">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setSteps(prev => [...prev, ''])} className="flex items-center gap-2 text-sm text-dapur-orange font-bold mt-2">
                    <Plus size={16} /> Tambah Langkah
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t flex justify-end gap-4 bg-white">
            <Button variant="outline" onClick={onClose} type="button" className="px-8 rounded-2xl">Batal</Button>
            <Button type="submit" loading={loading} className="px-10 rounded-2xl bg-blue-600 hover:bg-blue-700">Perbarui Resep</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeModal;