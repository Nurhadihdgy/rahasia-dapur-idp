import { useState, useCallback } from 'react';
import { tipsService } from '../api/tipsService';

export const useTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTips = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await tipsService.getAll(params);
      setTips(data.data.tips);
    } catch (error) {
      console.error("Gagal mengambil tips", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrendingTips = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await tipsService.getTrending(params);
      setTips(data.data.tips);
    } catch (error) {
      console.error("Gagal mengambil tips", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTip = async (formData) => {
    const data = await tipsService.create(formData);
    setRecipes((prev) => [data.data, ...prev]); // Jika ingin update list langsung
    return data;
  };

  const removeTip = async (id) => {
    await tipsService.delete(id);
    setTips((prev) => prev.filter((t) => t._id !== id));
  };

  return { tips, loading, fetchTips, fetchTrendingTips, addTip, removeTip };
};