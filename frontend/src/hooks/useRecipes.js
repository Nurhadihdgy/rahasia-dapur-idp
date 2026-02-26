import { useState, useCallback } from 'react';
import { recipeService } from '../api/recipeService';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await recipeService.getAll(params);
      setRecipes(data.data.recipes);
    } catch (error) {
      console.error("Gagal mengambil resep", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecipe = async (formData) => {
    const data = await recipeService.create(formData);
    setRecipes((prev) => [data.data, ...prev]);
    return data;
  };

  const removeRecipe = async (id) => {
    await recipeService.delete(id);
    setRecipes((prev) => prev.filter((r) => r._id !== id));
  };

  return { recipes, loading, fetchRecipes, addRecipe, removeRecipe };
};