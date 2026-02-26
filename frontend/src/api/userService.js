import axiosInstance from './axiosInstance';

export const userService = {
  getAll: async (params) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },
  create: async (userData) => {
    const response = await axiosInstance.post(`/users`, userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },
  updateRole: async (id, roleData) => {
    const response = await axiosInstance.put(`/users/${id}/role`, roleData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};