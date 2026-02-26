import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ArrowRight, Lightbulb } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const TipsCard = ({ item }: { item: any }) => {
  return (
    <Link href={`/detail/tips/${item._id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.media.thumbnail || item.media?.thumbnail}} style={styles.thumbnail} contentFit="cover" />
        <View style={styles.content}>
          <View style={styles.header}>
            <Lightbulb size={16} color="#FF7A00" />
            <Text style={styles.category}>{item.type || 'Tips'}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <View style={styles.footer}>
            <Text style={styles.linkText}>Baca Tips</Text>
            <ArrowRight size={14} color="#FF7A00" />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 12, marginBottom: 12, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  thumbnail: { width: 80, height: 80, borderRadius: 16 },
  content: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  category: { fontSize: 10, fontWeight: 'bold', color: '#FF7A00', textTransform: 'uppercase' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  linkText: { fontSize: 12, fontWeight: '700', color: '#FF7A00' }
});