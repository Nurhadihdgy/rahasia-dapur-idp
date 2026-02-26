import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../api/authService';
import { Button } from '../../components/common/Button';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function EditProfile() {
  const { user, login } = useAuthContext();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await authService.updateProfile(form);
      const token = await AsyncStorage.getItem('token');
      await login(res.data.data, token || ''); //
      
      showToast("Profil berhasil diperbarui", "success");
      router.back();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Gagal memperbarui profil", "error");
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
        <Text style={styles.headerTitle}>Ubah Profil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formSection}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput 
            style={styles.input} 
            value={form.name} 
            onChangeText={(t) => setForm({...form, name: t})} 
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#BBB" //
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            value={form.email} 
            onChangeText={(t) => setForm({...form, email: t})} 
            placeholder="Masukkan email aktif"
            placeholderTextColor="#BBB" //
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Simpan Perubahan" onPress={handleUpdate} loading={loading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A', //
  },
  headerSpacer: { 
    width: 40 
  },
  scrollContent: { 
    paddingHorizontal: 24, 
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1 
  },
  formSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF7A00',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: { 
    backgroundColor: '#F9F9F9', 
    color: '#333', //
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#F0F0F0',
    fontSize: 16,
  },
  buttonWrapper: {
    marginTop: 'auto',
  }
});