import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextData {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: any, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Perbaikan: Tambahkan tipe generik <any> dan <string | null>
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');

      if (authDataSerialized && storedToken) {
        setUser(JSON.parse(authDataSerialized));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Gagal memuat data auth", error);
    } finally {
      setLoading(false);
    }
  }

  const login = async (userData: any, userToken: string) => {
    
    const refreshTokens = userData.refreshTokens;
    const latestRefreshToken = refreshTokens && refreshTokens.length > 0 
      ? refreshTokens[refreshTokens.length - 1].token 
      : null;


    setUser(userData);
    setToken(userToken);

    // 3. Simpan ke Storage secara atomik
    try {
      const storageItems: [string, string][] = [
        ['user', JSON.stringify(userData)],
        ['token', userToken],
      ];

      if (latestRefreshToken) {
        storageItems.push(['refreshToken', latestRefreshToken]);
      }

      await AsyncStorage.multiSet(storageItems);
    } catch (error) {
      console.error("Gagal menyimpan ke storage", error);
    }
  };

  const logout = async () => {
    try {
      // Hapus semua token sensitif agar axios interceptor berhenti melakukan refresh
      await AsyncStorage.multiRemove(['user', 'token', 'refreshToken']);
      
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Gagal logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);