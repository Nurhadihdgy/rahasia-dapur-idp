import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan Bearer Token otomatis
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
//Response Interceptor: Menangani 401 dan Refresh Token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 (Unauthorized) dan belum mencoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang ada proses refresh lain, masukkan request ini ke antrean
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
        // AMBIL REFRESH TOKEN DARI LOCALSTORAGE
        const storedRefreshToken = localStorage.getItem("refreshToken");

        // KIRIM REFRESH TOKEN DI DALAM BODY REQUEST
        const res = await axiosInstance.post("/auth/refresh-token", {
          refreshToken: storedRefreshToken
        });

        if (res.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;

          // Simpan access token baru
          localStorage.setItem("token", accessToken);
          
          // Update refreshToken jika ada rotasi dari backend
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          processQueue(null, accessToken);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Bersihkan data sesi jika gagal
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
