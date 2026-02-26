import axiosInstance from "./axiosInstance";

export const recipeService = {
  getAll: async (params = {}) => {
    return await axiosInstance.get("/recipe", { params });
  },

  getById: async (id: string) => {
    return await axiosInstance.get(`/recipe/${id}`);
  },
};
