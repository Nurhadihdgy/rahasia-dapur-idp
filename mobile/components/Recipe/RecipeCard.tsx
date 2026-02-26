import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Clock, Utensils } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const RecipeCard = ({ item }: { item: any }) => {
  return (
    <Link href={`/detail/recipe/${item._id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image 
          source={{ uri: item.media?.thumbnail || item.media?.url }} 
          style={styles.image} 
          contentFit="cover"
          transition={500}
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <View style={styles.footer}>
            <View style={styles.info}>
              <Clock size={14} color="#999" />
              <Text style={styles.infoText}>{item.cookingTime || '45'} Min</Text>
            </View>
            <Utensils size={18} color="#FF7A00" />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 24, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  image: { width: '100%', height: 180 },
  badge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#FF7A00', textTransform: 'uppercase' },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F9F9F9' },
  info: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: 12, color: '#999', fontWeight: '500' }
});