import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk visibilitas password
  const { login, loading } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Tombol Kembali ke Index */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.replace('/(tabs)')}
      >
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        {/* Logo Besar di atas teks Masuk Akun */}
        <Image 
          source={require('../../assets/images/Logo-besar.png')} 
          style={styles.mainLogo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Masuk Akun</Text>
        
        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#999" 
          style={styles.input} 
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password Input dengan Icon Mata */}
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="Password" 
            placeholderTextColor="#999"
            style={styles.passwordInput} 
            secureTextEntry={!showPassword} 
            onChangeText={setPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? <EyeOff size={22} color="#999" /> : <Eye size={22} color="#999" />}
          </TouchableOpacity>
        </View>
        
        <Button 
          title="Login Sekarang" 
          onPress={() => login({ email, password })} 
          loading={loading}
        />

        {/* Tombol ke Halaman Daftar */}
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/register')}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>
            Belum punya akun? <Text style={styles.registerHighlight}>Daftar di sini</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8
  },
  backText: {
    fontSize: 16,
    color: '#333', 
    fontWeight: '500'
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    marginTop: -40,
  },
  mainLogo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#FF7A00', 
    marginBottom: 40, 
    textAlign: 'center' 
  },
  input: { 
    backgroundColor: '#F9F9F9', 
    color: '#333', // Proteksi warna teks di dark mode
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#EEE' 
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  registerLink: {
    marginTop: 25,
    alignItems: 'center'
  },
  registerText: {
    fontSize: 14,
    color: '#666', 
  },
  registerHighlight: {
    color: '#FF7A00',
    fontWeight: 'bold'
  }
});