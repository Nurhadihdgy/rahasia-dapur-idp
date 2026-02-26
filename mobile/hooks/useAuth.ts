import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { authService } from "../api/authService";
import { useAuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { login: saveAuthData, logout: clearAuthData } = useAuthContext();
  const { showToast } = useToast();
  const router = useRouter();

  const login = async (credentials: any) => {
    try {
      setLoading(true);
      const res = await authService.login(credentials);

      // Data berada di res.data.data berdasarkan struktur JSON yang Anda berikan
      const responseData = res.data.data;
      const user = responseData.userResponse;
      const token = responseData.accessToken;

      if (!token) {
        showToast("Token tidak ditemukan", "error");
        return;
      }
      await saveAuthData(user, token);

      showToast("Selamat datang kembali!", "success");

      // Gunakan replace agar user tidak bisa kembali ke halaman login
      router.replace("/(tabs)");
    } catch (err: any) {
      const message = err.response?.data?.message || "Koneksi ke server gagal";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      // 1. Ambil refreshToken dari storage untuk dikirim ke backend
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      // 2. Panggil API Logout dengan mengirimkan refreshToken di body
      // Sesuaikan parameter authService.logout jika sebelumnya tidak menerima argumen
      await authService.logout({ refreshToken });

      // 3. Bersihkan data lokal (Context & AsyncStorage)
      await clearAuthData();

      showToast("Berhasil keluar", "success");
      router.replace("/(auth)/login");
    } catch (err: any) {
      // Jika API gagal (401 atau server down), tetap bersihkan data lokal agar user tidak terjebak
      await clearAuthData();
      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  };

  return { login, handleLogout, loading };
};
