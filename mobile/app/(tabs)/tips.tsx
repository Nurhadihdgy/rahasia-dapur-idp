import { Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Rapikan Safe Area
import { TipsCard } from '../../components/Tips/TipsCard';
import { useTips } from '../../hooks/useTips';

export default function Tips() {
  const { tips, fetchTips, loading } = useTips();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTips();
  }, []);

  // Logika pencarian tips secara lokal
  const filteredTips = Array.isArray(tips) 
    ? tips.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header dengan Pencarian */}
      <View style={styles.header}>
        <Text style={styles.title}>Tips & Trik</Text>
        <Text style={styles.subtitle}>Rahasia dapur untuk masakan lebih lezat.</Text>
        
        <View style={styles.searchBox}>
          <Search size={20} color="#999" />
          <TextInput 
            placeholder="Cari tips dapur..." 
            placeholderTextColor="#999" // Kunci warna agar tidak hilang
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredTips}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TipsCard item={item} />
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchTips}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Tips tidak ditemukan.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    paddingHorizontal: 24, 
    paddingTop: 10,
    paddingBottom: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1A1A1A',
    letterSpacing: -0.5 
  },
  subtitle: { 
    color: '#666', 
    marginTop: 4,
    fontSize: 15,
    marginBottom: 20
  },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F7F7F7', 
    paddingHorizontal: 16, 
    borderRadius: 18, 
    height: 54,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  input: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16,
    color: '#333' // Kunci warna teks agar tidak putih
  },
  list: { 
    paddingHorizontal: 24,
    paddingBottom: 40 
  },
  cardWrapper: {
    marginBottom: 16
  },
  empty: { 
    textAlign: 'center', 
    marginTop: 80, 
    color: '#999',
    fontSize: 16 
  }
});