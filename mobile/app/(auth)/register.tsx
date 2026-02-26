import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../api/authService';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword : '' });
  const [loading, setLoading] = useState(false);
  
  // State untuk kontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      return showToast("Konfirmasi password tidak cocok", "error");
    }

    try {
      setLoading(true);
      await authService.register(form);
      showToast("Berhasil mendaftar, silakan login", "success");
      router.replace('/(auth)/login');
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal mendaftar";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image 
          source={require('../../assets/images/Logo-besar.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Buat Akun</Text>
        <Text style={styles.subtitle}>Gabung dengan komunitas Rahasia Dapur</Text>

        {/* Input Nama */}
        <TextInput 
          placeholder="Nama Lengkap" 
          placeholderTextColor="#999" 
          style={styles.input} 
          onChangeText={t => setForm({...form, name: t})} 
        />

        {/* Input Email */}
        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#999" 
          style={styles.input} 
          autoCapitalize="none" 
          keyboardType="email-address"
          onChangeText={t => setForm({...form, email: t})} 
        />

        {/* Input Password dengan Icon Mata */}
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="Password" 
            placeholderTextColor="#999" 
            style={styles.passwordInput} 
            secureTextEntry={!showPassword} 
            onChangeText={t => setForm({...form, password: t})} 
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {showPassword ? <EyeOff size={22} color="#999" /> : <Eye size={22} color="#999" />}
          </TouchableOpacity>
        </View>

        {/* Input Konfirmasi Password dengan Icon Mata */}
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="Konfirmasi Password" 
            placeholderTextColor="#999" 
            style={styles.passwordInput} 
            secureTextEntry={!showConfirmPassword} 
            onChangeText={t => setForm({...form, confirmPassword: t})} 
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            {showConfirmPassword ? <EyeOff size={22} color="#999" /> : <Eye size={22} color="#999" />}
          </TouchableOpacity>
        </View>
        
        <Button title="Daftar Sekarang" onPress={handleRegister} loading={loading} />
        
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.footerLink}>
          <Text style={styles.footerText}>
            Sudah punya akun? <Text style={styles.footerHighlight}>Masuk</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scrollContent: { 
    paddingHorizontal: 30, 
    paddingBottom: 40,
    alignItems: 'center'
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: { 
    fontSize: 30, 
    fontWeight: '900', 
    color: '#FF7A00', // Konsisten dengan warna brand
    textAlign: 'center' 
  },
  subtitle: { 
    color: '#999', 
    marginBottom: 35, 
    fontSize: 16, 
    textAlign: 'center' 
  },
  input: { 
    width: '100%',
    backgroundColor: '#F9F9F9', 
    color: '#333', // Proteksi warna teks di dark mode
    padding: 18, 
    borderRadius: 16, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#EEE' 
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  passwordInput: {
    flex: 1,
    padding: 18,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  footerLink: { 
    marginTop: 25 
  },
  footerText: { 
    textAlign: 'center', 
    color: '#666' 
  },
  footerHighlight: { 
    color: '#FF7A00', 
    fontWeight: 'bold' 
  }
});