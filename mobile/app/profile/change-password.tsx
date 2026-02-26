import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../api/authService';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  
  // State untuk kontrol visibility password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const handleChange = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return showToast("Konfirmasi password tidak cocok", "error");
    }
    try {
      setLoading(true);
      await authService.changePassword(form);
      showToast("Password berhasil diubah", "success");
      router.back();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Gagal mengubah password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Password</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formSection}>
          {/* Password Saat Ini */}
          <Text style={styles.label}>Password Saat Ini</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              secureTextEntry={!showCurrent} 
              placeholder="Masukkan password saat ini"
              placeholderTextColor="#BBB"
              onChangeText={(t) => setForm({...form, currentPassword: t})}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
            </TouchableOpacity>
          </View>

          {/* Password Baru */}
          <Text style={styles.label}>Password Baru</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              secureTextEntry={!showNew} 
              placeholder="Masukkan password baru"
              placeholderTextColor="#BBB"
              onChangeText={(t) => setForm({...form, newPassword: t})}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
            </TouchableOpacity>
          </View>

          {/* Konfirmasi Password */}
          <Text style={styles.label}>Konfirmasi Password Baru</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              secureTextEntry={!showConfirm} 
              placeholder="Ulangi password baru"
              placeholderTextColor="#BBB"
              onChangeText={(t) => setForm({...form, confirmPassword: t})}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Update Password" onPress={handleChange} loading={loading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  headerSpacer: { width: 40 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40, flexGrow: 1 },
  formSection: { marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '700', color: '#FF7A00', marginBottom: 8, marginLeft: 4 },
  
  // Container baru untuk menampung input dan ikon mata
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: { 
    flex: 1,
    color: '#333', 
    padding: 16, 
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  buttonWrapper: { marginTop: 'auto' }
});