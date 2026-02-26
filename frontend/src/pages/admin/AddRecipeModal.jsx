import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useRecipes } from '../../hooks/useRecipes';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AddRecipeModal = ({ onClose, onSuccess }) => {
  const { addRecipe } = useRecipes();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // State untuk menampung pesan error validasi
  const [errors, setErrors] = useState({});
  
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Main Course',
    youtubeUrl: ''
  });

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  // Fungsi Validasi Client-side
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Judul resep wajib diisi";
    if (!formData.description.trim()) newErrors.description = "Deskripsi wajib diisi";
    
    // Validasi jika ada bahan yang kosong
    if (ingredients.some(ing => !ing.trim())) {
      newErrors.ingredients = "Semua kolom bahan harus diisi";
    }
    
    // Validasi jika ada langkah yang kosong
    if (steps.some(step => !step.trim())) {
      newErrors.steps = "Semua kolom langkah harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddField = (setter) => setter(prev => [...prev, '']);
  const handleRemoveField = (index, setter) => setter(prev => prev.filter((_, i) => i !== index));
  
  const handleFieldChange = (index, value, setter, errorKey) => {
    // Hapus pesan error saat user mulai mengetik
    if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: null }));
    
    setter(prev => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Jalankan validasi sebelum kirim ke API
    if (!validateForm()) {
      showToast("Mohon lengkapi kolom yang wajib diisi", "error");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('youtubeUrl', formData.youtubeUrl);
    
    ingredients.forEach((ing, i) => data.append(`ingredients[${i}]`, ing));
    steps.forEach((step, i) => data.append(`steps[${i}]`, step));
    if (mediaFile) data.append('media', mediaFile);

    try {
      await addRecipe(data);
      showToast("Resep berhasil ditambahkan", "success");
      onSuccess();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menambahkan resep", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Tambah Resep Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 bg-[#FDFDFD]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* KIRI: Informasi & Media */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Input 
                  label="Judul Resep" 
                  placeholder="Masukkan judul (contoh: Soto Ayam)"
                  required 
                  error={errors.title}
                  value={formData.title}
                  onChange={e => {
                    setFormData({...formData, title: e.target.value});
                    if (errors.title) setErrors({...errors, title: null});
                  }} 
                />
                
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className={`w-full px-4 py-3 bg-white rounded-xl border transition-all outline-none h-32 resize-none ${errors.description ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange'}`}
                    placeholder="Tuliskan cerita singkat tentang resep ini..."
                    value={formData.description}
                    onChange={e => {
                      setFormData({...formData, description: e.target.value});
                      if (errors.description) setErrors({...errors, description: null});
                    }}
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Kategori</label>
                  <select 
                    className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 transition-all outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange appearance-none"
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
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} 
                />
              </div>

              {/* Preview Section */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">Thumbnail Resep</label>
                <div className={`border-2 border-dashed rounded-3xl overflow-hidden flex flex-col items-center justify-center bg-white ${previewUrl ? 'border-orange-300' : 'border-gray-200 h-48'}`}>
                  {previewUrl ? (
                    <div className="relative w-full h-64">
                      {mediaFile?.type.startsWith('video') ? (
                        <video src={previewUrl} className="w-full h-full object-cover" controls />
                      ) : (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      )}
                      <button 
                        type="button"
                        onClick={() => { setMediaFile(null); setPreviewUrl(null); }}
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center p-10 w-full hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-dapur-orange">
                        <ImageIcon size={32} />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Klik untuk unggah foto/video resep</span>
                      <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* KANAN: Bahan & Langkah */}
            <div className="space-y-6">
              {/* Ingredients */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <label className="text-base font-black text-gray-800 block mb-4 border-l-4 border-dapur-orange pl-3 italic">
                  Bahan-bahan <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {ingredients.map((ing, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex gap-2 items-center">
                        <Input 
                          placeholder="Contoh: 2 siung bawang putih"
                          value={ing} 
                          error={i === ingredients.length - 1 ? errors.ingredients : null}
                          onChange={e => handleFieldChange(i, e.target.value, setIngredients, 'ingredients')}
                        />
                        {ingredients.length > 1 && (
                          <button type="button" onClick={() => handleRemoveField(i, setIngredients)} className="text-red-300 hover:text-red-500">
                            <Trash2 size={20}/>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {errors.ingredients && <p className="text-xs text-red-500 mt-1">{errors.ingredients}</p>}
                  <button type="button" onClick={() => handleAddField(setIngredients)} className="flex items-center gap-2 text-sm text-dapur-orange font-bold mt-2">
                    <Plus size={16} /> Tambah Bahan
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <label className="text-base font-black text-gray-800 block mb-4 border-l-4 border-dapur-orange pl-3 italic">
                  Langkah Memasak <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex gap-3 items-start">
                        <span className="mt-3 font-bold text-orange-200">{i + 1}</span>
                        <textarea 
                          className={`flex-1 px-4 py-3 bg-white rounded-xl border transition-all outline-none h-20 resize-none ${errors.steps ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange'}`} 
                          value={step} 
                          onChange={e => handleFieldChange(i, e.target.value, setSteps, 'steps')}
                          placeholder="Contoh: Tumis bumbu hingga harum..."
                        />
                        {steps.length > 1 && (
                          <button type="button" onClick={() => handleRemoveField(i, setSteps)} className="text-red-300 hover:text-red-500 mt-2">
                            <Trash2 size={20}/>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {errors.steps && <p className="text-xs text-red-500 mt-1 ml-7">{errors.steps}</p>}
                  <button type="button" onClick={() => handleAddField(setSteps)} className="flex items-center gap-2 text-sm text-dapur-orange font-bold mt-2">
                    <Plus size={16} /> Tambah Langkah
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t flex justify-end gap-4 bg-white">
            <Button variant="outline" onClick={onClose} type="button" className="px-8 rounded-2xl">Batal</Button>
            <Button type="submit" loading={loading} className="px-10 rounded-2xl">Simpan Resep</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;