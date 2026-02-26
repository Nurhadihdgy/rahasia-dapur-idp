import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { useAuthContext } from "../context/AuthContext"; // Pastikan import context

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useAuthContext(); // Gunakan setUser dari context Anda
  const navigate = useNavigate();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);

      // Sesuai struktur JSON: response.data.data
      const responseData = response.data;
      const userData = responseData.userResponse;
      const token = responseData.accessToken;

      // Ekstraksi Refresh Token terbaru dari array
      const refreshTokens = userData.refreshTokens;
      const latestRefreshToken =
        refreshTokens && refreshTokens.length > 0
          ? refreshTokens[refreshTokens.length - 1].token
          : null;

      if (!userData) {
        throw new Error("Data user tidak ditemukan dalam response");
      }

      // 1. Simpan ke localStorage untuk persistensi
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      if (latestRefreshToken) {
        localStorage.setItem("refreshToken", latestRefreshToken); // Simpan ini untuk Axios Body
      }

      // 2. Update Global State (Context) agar Navbar/Profile berubah
      setUser(userData);

      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.loginadmin(credentials);

      // Sesuai struktur JSON: response.data.data
      const responseData = response.data;
      const userData = responseData.userResponse;
      const token = responseData.accessToken;

      // Ekstraksi Refresh Token terbaru dari array
      const refreshTokens = userData.refreshTokens;
      const latestRefreshToken =
        refreshTokens && refreshTokens.length > 0
          ? refreshTokens[refreshTokens.length - 1].token
          : null;

      if (!userData) {
        throw new Error("Data user tidak ditemukan dalam response");
      }

      // 1. Simpan ke localStorage untuk persistensi
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      if (latestRefreshToken) {
        localStorage.setItem("refreshToken", latestRefreshToken); // Simpan ini untuk Axios Body
      }

      // 2. Update Global State (Context) agar Navbar/Profile berubah
      setUser(userData);

      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Panggil API logout agar token di DB dihapus
      await authService.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Bersihkan semua data lokal tanpa pandang bulu
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);

      navigate("/login");
    }
  };

  return { login, logout, loginAdmin, loading, error };
};
