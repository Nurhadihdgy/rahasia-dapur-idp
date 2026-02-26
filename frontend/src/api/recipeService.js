import axiosInstance from './axiosInstance';

export const recipeService = {
  getAll: async (params) => {
    const response = await axiosInstance.get('/recipe', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosInstance.get(`/recipe/${id}`);
    return response.data;
  },
  create: async (formData) => {
    // FormData otomatis mengatur Content-Type menjadi multipart/form-data
    const response = await axiosInstance.post('/recipe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await axiosInstance.put(`/recipe/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/recipe/${id}`);
    return response.data;
  },
};