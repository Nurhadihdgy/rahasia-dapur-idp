import { Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Gunakan dari context
import { RecipeCard } from '../../components/Recipe/RecipeCard';
import { useRecipes } from '../../hooks/useRecipes';

export default function Recipes() {
  const { recipes, fetchRecipes, loading } = useRecipes();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}> 
      {/* edges=['top'] digunakan agar SafeAreaView hanya menangani bagian atas, 
          bagian bawah biarkan diatur oleh padding FlatList agar scrolling lebih smooth */}
      
      <View style={styles.header}>
        <Text style={styles.title}>Jelajahi Resep</Text>
        <View style={styles.searchBox}>
          <Search size={20} color="#999" />
          <TextInput 
            placeholder="Cari resep masakan..." 
            placeholderTextColor="#999" // Kunci warna placeholder agar tidak hilang
            style={styles.input}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <RecipeCard item={item} />
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchRecipes}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Resep tidak ditemukan.</Text>}
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
    paddingBottom: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1A1A1A', 
    marginBottom: 16,
    letterSpacing: -0.5
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
    color: '#333' // Kunci warna teks agar tidak putih saat dark mode
  },
  list: { 
    paddingHorizontal: 24,
    paddingBottom: 40 // Padding bawah agar kartu terakhir tidak mepet navigasi
  },
  cardWrapper: {
    marginBottom: 20
  },
  empty: { 
    textAlign: 'center', 
    marginTop: 80, 
    color: '#999',
    fontSize: 16
  }
});