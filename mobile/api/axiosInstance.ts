import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
const axiosInstance = axios.create({
  // Gunakan IP Address laptop Anda, bukan localhost
  baseURL: "https://backend-rahasia-dapur.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        // Request ke endpoint refresh-token
        const res = await axiosInstance.post("/auth/refresh-token", {
          refreshToken: refreshToken,
        });

        // Jika response sukses (200/201)
        if (res.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;

          await AsyncStorage.setItem("token", accessToken);
          await AsyncStorage.setItem("refreshToken", newRefreshToken);

          axiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
          processQueue(null, accessToken);

          return axiosInstance(originalRequest);
        } else {
          // Jika success: false meski status 200
          throw new Error("Refresh token invalid");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // PEMBERSIHAN DATA & REDIRECT
        await AsyncStorage.multiRemove(["token", "refreshToken", "user"]);

        // Gunakan router.replace agar user tidak bisa kembali ke halaman sebelumnya
        router.replace("/(auth)/login");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
