import axiosInstance from "./axiosInstance";

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },
  loginadmin: async (credentials) => {
    const response = await axiosInstance.post("/auth/admin/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },
  logout: async () => {
    return await axiosInstance.post("/auth/logout");
  },
  getProfile: async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  },
  updateProfile: async (data) => {
    return await axiosInstance.put("/auth/profile", data); //
  },
  
  changePassword: async (data) => {
    return await axiosInstance.put("/auth/change-password", data); //
  },
};
