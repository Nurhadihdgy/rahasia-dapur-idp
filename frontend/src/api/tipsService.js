import axiosInstance from './axiosInstance';

export const tipsService = {
  getAll: async (params) => {
    const response = await axiosInstance.get('/tips', { params });
    return response.data;
  },
  getById: async (id) => {
    // Pastikan menggunakan backtick (`) di awal dan akhir URL
    return await axiosInstance.get(`/tips/${id}`);
  },
  getTrending: async (params) => {
    const response = await axiosInstance.get('/tips/trending', { params });
    return response.data;
  },
  create: async (formData) => {
    const response = await axiosInstance.post('/tips', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await axiosInstance.put(`/tips/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  toggleLike: async (id) => {
    // Memanggil http://127.0.0.1:5000/api/tips/:id/like
    return await axiosInstance.post(`/tips/${id}/like`);
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/tips/${id}`);
    return response.data;
  },
};