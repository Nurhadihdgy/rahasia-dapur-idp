import { useCallback, useState } from "react";
import { recipeService } from "../api/recipeService";
import { useToast } from "../context/ToastContext";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Mengambil semua resep
  const fetchRecipes = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const res = await recipeService.getAll(params);
        if (res.data && res.data.success) {
          // Cek apakah data list ada di dalam res.data.data.recipes atau langsung di res.data.data
          const listData = res.data.data.recipes || res.data.data;
          setRecipes(Array.isArray(listData) ? listData : []);
        }
      } catch (err) {
        showToast("Gagal mengambil daftar resep", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  // Mengambil satu resep berdasarkan ID
  const fetchRecipeById = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const res = await recipeService.getById(id);

        // SESUAI RESPONSE JSON: data resep ada langsung di res.data.data
        if (res.data && res.data.success) {
          setRecipe(res.data.data);
        }
      } catch (err) {
        console.error("Detail Recipe Error:", err);
        showToast("Gagal mengambil detail resep", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  return { recipes, recipe, loading, fetchRecipes, fetchRecipeById };
};
