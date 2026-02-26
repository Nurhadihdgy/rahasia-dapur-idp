import { useState, useCallback } from 'react';
import { userService } from '../api/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

   const fetchUsers = useCallback(async (params) => {
      setLoading(true);
      try {
        const data = await userService.getAll(params);
        setUsers(data.data.users);
      } catch (error) {
        console.error("Gagal mengambil resep", error);
      } finally {
        setLoading(false);
      }
    }, []);

  const changeRole = async (id, role) => {
    const data = await userService.updateRole(id, { role });
    setUsers((prev) => 
      prev.map((u) => (u._id === id ? { ...u, role: data.data.role } : u))
    );
  };

  const removeUser = async (id) => {
    await userService.delete(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return { users, loading, fetchUsers, changeRole, removeUser };
};