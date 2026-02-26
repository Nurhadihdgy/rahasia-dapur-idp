import axiosInstance from "./axiosInstance";

export const tipsService = {
  // Mengambil semua tips (mendukung limit untuk Home)
  getAll: async (params = {}) => {
    return await axiosInstance.get("/tips", { params });
  },

  // Mengambil detail tips berdasarkan ID
  getById: async (id: string) => {
    return await axiosInstance.get(`/tips/${id}`);
  },

  // Toggle Like
  toggleLike: async (id: string) => {
    return await axiosInstance.post(`/tips/${id}/like`);
  },
};
