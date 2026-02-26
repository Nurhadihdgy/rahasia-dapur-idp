import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    // Memuat data sesi saat aplikasi pertama kali dijalankan
    const loadStorageData = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        // Sesi dianggap valid jika user, token, dan refreshToken tersedia
        if (savedUser && token && refreshToken) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Gagal sinkronisasi storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = (userData, token) => {
  // Gunakan optional chaining (?.) untuk menghindari error undefined
  const refreshTokens = userData?.refreshTokens || []; 
  
  const latestRefreshToken = refreshTokens.length > 0 
    ? refreshTokens[refreshTokens.length - 1].token 
    : null;

  setUser(userData);
  
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);
  
  if (latestRefreshToken) {
    localStorage.setItem('refreshToken', latestRefreshToken);
  } else {
    // Opsional: Hapus sisa token lama jika login baru tidak memberikan refresh token
    localStorage.removeItem('refreshToken');
  }
};

  const logout = () => {
    setUser(null);
    // Hapus semua data sesi dari storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, // Expose setUser agar data profil bisa diupdate tanpa login ulang
      login, 
      logout, 
      isAuthenticated: !!user, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);