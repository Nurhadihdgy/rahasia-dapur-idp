import axiosInstance from "./axiosInstance";

export const authService = {
  login: async (credentials: any) => {
    return await axiosInstance.post("/auth/login", credentials);
  },

  register: async (userData: any) => {
    return await axiosInstance.post("/auth/register", userData);
  },

  getProfile: async () => {
    return await axiosInstance.get("/auth/profile");
  },

  logout: async (data?: { refreshToken: string | null }) => {
    return await axiosInstance.post("/auth/logout", data); //
  },

  updateProfile: async (data: { name: string; email: string }) => {
    return await axiosInstance.put("/auth/profile", data);
  },
  changePassword: async (data: any) => {
    return await axiosInstance.put("/auth/change-password", data);
  },
};
