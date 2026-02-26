import React, { createContext, useContext } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';

interface ToastContextData {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      // Untuk iOS menggunakan Alert bawaan
      Alert.alert(type.toUpperCase(), message);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);