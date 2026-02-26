import React, { useEffect, useState, useMemo } from "react";
import { useRecipes } from "../../hooks/useRecipes";
import { useToast } from "../../context/ToastContext";
import DataTable from "../../components/shared/DataTable";
import Button from "../../components/common/Button";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react"; // Tambah icon Search
import AddRecipeModal from "./AddRecipeModal";
import RecipeDetailModal from "./RecipeDetailModal";
import EditRecipeModal from './EditRecipeModal';

const ManageRecipes = () => {
  const { recipes, loading, fetchRecipes, removeRecipe } = useRecipes();
  const { showToast } = useToast();

  // State untuk Modal & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fitur Pencarian Client-side
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recipes, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Hapus resep ini?")) {
      try {
        await removeRecipe(id);
        showToast("Recipe deleted successfully", "success");
        fetchRecipes();
      } catch (err) {
        showToast("Failed to delete", "error");
      }
    }
  };

  return (
    <div className="space-y-6"> {/* Memberikan jarak antar elemen utama */}
      
      {/* Header & Search Bar Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Manage Recipes</h1>
          <p className="text-sm text-gray-500">Kelola daftar resep dan konten dapur Anda.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Input Pencarian */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dapur-orange transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Cari resep atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl w-full sm:w-64 outline-none focus:border-dapur-orange focus:ring-1 focus:ring-dapur-orange transition-all shadow-sm"
            />
          </div>

          <Button onClick={() => setIsAddModalOpen(true)} variant="primary" className="shadow-lg shadow-orange-100">
            <Plus size={20} className="mr-2" /> Add Recipe
          </Button>
        </div>
      </div>

      {/* Jarak antara search/button dan tabel diatur oleh space-y-6 di parent div */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <DataTable headers={["Recipe", "Category", "Actions"]}>
          {filteredRecipes.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-10 text-center text-gray-400 italic">
                {searchTerm ? "Resep tidak ditemukan..." : "Belum ada data resep."}
              </td>
            </tr>
          ) : (
            filteredRecipes.map((recipe) => (
              <tr
                key={recipe._id}
                className="hover:bg-gray-50/50 border-b border-gray-100 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={recipe.media?.thumbnail || "https://via.placeholder.com/150"}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                    alt={recipe.title}
                  />
                  <span className="font-bold text-gray-700">{recipe.title}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-orange-50 text-dapur-orange px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {recipe.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRecipe(recipe)}
                      className="p-2.5 bg-orange-50 text-dapur-orange rounded-xl hover:bg-dapur-orange hover:text-white transition-all shadow-sm"
                      title="View Detail"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => setEditingRecipe(recipe)}
                      className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                      title="Edit Recipe"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Delete Recipe"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </DataTable>
      </div>

      {/* MODAL SECTION */}
      {isAddModalOpen && (
        <AddRecipeModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchRecipes();
          }}
        />
      )}

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {editingRecipe && (
        <EditRecipeModal 
          recipe={editingRecipe} 
          onClose={() => setEditingRecipe(null)} 
          onSuccess={() => { setEditingRecipe(null); fetchRecipes(); }}
        />
      )}
    </div>
  );
};

export default ManageRecipes;