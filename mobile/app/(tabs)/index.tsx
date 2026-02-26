import { TipsCard } from '@/components/Tips/TipsCard';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Pastikan gunakan ini agar rapi
import { RecipeCard } from '../../components/Recipe/RecipeCard';
import { useAuthContext } from '../../context/AuthContext';
import { useRecipes } from '../../hooks/useRecipes';
import { useTips } from '../../hooks/useTips';

export default function Home() {
  const { recipes, fetchRecipes } = useRecipes();
  const { tips, fetchTrendingTips } = useTips();
  const { user, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecipes({ limit: 4 });
    }
    fetchTrendingTips();
  }, [isAuthenticated]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Top Identity Bar */}
      <View style={styles.topBar}>
        <Image 
          source={require('../../assets/images/Logo-besar.png')} 
          style={styles.smallLogo}
          resizeMode="contain"
        />
        <Text style={styles.brand}>Rahasia Dapur - PKK</Text>
        <View style={styles.topActions}>
          <TouchableOpacity 
            style={styles.profileCircle}
            onPress={() => router.push(isAuthenticated ? '/profile' : '/(auth)/login')}
          >
            <View style={styles.avatarPlaceholder}>
              {isAuthenticated ? (
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              ) : (
                <User size={20} color="#FF7A00" strokeWidth={2.5} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* Header Section */}
        <View style={styles.header}>
          {isAuthenticated ? (
            <>
              <Text style={styles.greeting}>Halo, {user?.name || 'Koki'}! 👋</Text>
              <Text style={styles.title}>Mau masak apa{"\n"}hari ini?</Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Temukan Rahasia{"\n"}Dapur Terbaik</Text>
              <Text style={styles.subtitle}>Eksplorasi resep lezat setiap hari.</Text>
            </>
          )}
        </View>

        {/* Auth Call to Action for Guests */}
        {!isAuthenticated && (
          <View style={styles.authCard}>
            <Text style={styles.authCardText}>Daftar sekarang untuk akses penuh fitur eksklusif kami!</Text>
            <View style={styles.authButtons}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnLogin]} 
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.btnTextLogin}>Masuk</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, styles.btnRegister]} 
                onPress={() => router.push('/(auth)/register')}
              >
                <Text style={styles.btnTextRegister}>Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Section Resep Terbaru */}
        {isAuthenticated && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resep Terbaru</Text>
              <TouchableOpacity onPress={() => router.push('/recipe')}>
                <Text style={styles.seeAll}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {Array.isArray(recipes) && recipes.map(item => (
                <View key={item._id} style={styles.recipeWrapper}>
                  <RecipeCard item={item} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Section Tips Dapur Populer */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tips Dapur Populer</Text>
            <TouchableOpacity onPress={() => router.push('/tips')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tipsList}>
            {Array.isArray(tips) && tips.length > 0 ? (
              tips.slice(0, 3).map((item) => (
                <TipsCard key={item._id} item={item} />
              ))
            ) : (
              <Text style={styles.emptyText}>Belum ada tips populer hari ini.</Text>
            )}
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  smallLogo: {
    width: 40,
    height: 40,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { 
    paddingBottom: 30 
  },
  header: { 
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 25
  },
  greeting: { 
    color: '#FF7A00', 
    fontWeight: '700', 
    fontSize: 16,
    marginBottom: 4
  },
  brand: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#1A1A1A', 
    lineHeight: 36,
    letterSpacing: -0.5
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1A1A1A', 
    lineHeight: 36,
    letterSpacing: -0.5
  },
  subtitle: { 
    fontSize: 15, 
    color: '#666', 
    marginTop: 6 
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarPlaceholder: { 
    flex: 1, 
    backgroundColor: '#FF7A0008',
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarText: {
    color: '#FF7A00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authCard: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: '#FF7A00',
    borderRadius: 28,
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  authCardText: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#FFF', 
    marginBottom: 20,
    lineHeight: 24
  },
  authButtons: { 
    flexDirection: 'row', 
    gap: 12 
  },
  btn: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  btnLogin: { 
    backgroundColor: '#FFF' 
  },
  btnRegister: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.4)' 
  },
  btnTextLogin: { 
    color: '#FF7A00', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  btnTextRegister: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  sectionContainer: { 
    marginBottom: 32 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#1A1A1A',
  },
  seeAll: { 
    color: '#FF7A00', 
    fontWeight: '700', 
    fontSize: 14 
  },
  horizontalScroll: { 
    paddingLeft: 24 
  },
  recipeWrapper: { 
    width: 280, 
    marginRight: 16 
  },
  tipsList: { 
    paddingHorizontal: 24, 
    gap: 16 
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10
  }
});