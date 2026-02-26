import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) => {
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant], (disabled || loading) && styles.disabled]} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? "#FF7A00" : "#fff"} />
      ) : (
        <Text style={[styles.text, isOutline ? styles.textOutline : styles.textWhite]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#FF7A00' },
  secondary: { backgroundColor: '#FFF5ED' },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#FF7A00' },
  danger: { backgroundColor: '#FF4B4B' },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: '700' },
  textWhite: { color: '#fff' },
  textOutline: { color: '#FF7A00' },
});