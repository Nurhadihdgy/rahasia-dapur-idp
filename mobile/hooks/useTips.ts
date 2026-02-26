import axiosInstance from "@/api/axiosInstance";
import { useCallback, useState } from "react";
import { tipsService } from "../api/tipsService";
import { useToast } from "../context/ToastContext";

export const useTips = () => {
  const [tips, setTips] = useState<any[]>([]);
  const [tip, setTip] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchTips = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const res = await tipsService.getAll(params);
        if (res.data) {
          // Handle struktur response: { data: { tips: [...] } } atau { data: [...] }
          const data = res.data.data?.tips || res.data.tips || res.data;
          setTips(data);
        }
      } catch (err) {
        showToast("Gagal mengambil tips", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  const fetchTipById = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const res = await tipsService.getById(id);
        if (res.data) {
          setTip(res.data.data || res.data);
        }
      } catch (err) {
        showToast("Gagal memuat detail tips", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  const fetchTrendingTips = async () => {
    try {
      const res = await axiosInstance.get("/tips/trending");
      // Karena response API Anda adalah { success: true, data: [...] }
      if (res.data.success) {
        // Hanya simpan 3 data teratas ke dalam state
        setTips(res.data.data.slice(0, 3));
      }
    } catch (err) {
      console.error("Gagal mengambil tips trending", err);
    }
  };

  const toggleLikeTip = async (id: string) => {
    try {
      const res = await tipsService.toggleLike(id);
      return res.data;
    } catch (err) {
      showToast("Gagal memproses like", "error");
      throw err;
    }
  };

  return {
    tips,
    tip,
    loading,
    fetchTips,
    fetchTrendingTips,
    fetchTipById,
    toggleLikeTip,
  };
};
