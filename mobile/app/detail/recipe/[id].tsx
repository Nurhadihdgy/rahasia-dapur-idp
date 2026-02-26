import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, PlayCircle } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe"; // Mengganti WebView dengan YoutubePlayer
import { useRecipes } from '../../../hooks/useRecipes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { recipe, fetchRecipeById, loading } = useRecipes();
  
  // State untuk mengontrol pemutaran video
  const [playing, setPlaying] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    if (typeof id === 'string') fetchRecipeById(id);
  }, [id]);

  // Helper untuk mendapatkan Video ID dari URL YouTube
  const getYouTubeID = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Callback saat status video berubah
  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  if (loading || !recipe) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </View>
    );
  }

  const renderMedia = () => {
    const media = recipe.media;
    
    // Tampilan Thumbnail sebelum di-klik "Play"
    if (!showMedia && (media?.type === 'youtube' || media?.type === 'video')) {
      return (
        <TouchableOpacity style={styles.mediaWrapper} onPress={() => setShowMedia(true)}>
          <Image 
            source={{ uri: media?.thumbnail || media?.url }} 
            style={styles.image} 
            contentFit="cover"
          />
          <View style={styles.playOverlay}>
            <PlayCircle size={64} color="white" />
          </View>
        </TouchableOpacity>
      );
    }

    // Render YouTube menggunakan react-native-youtube-iframe
    if (media?.type === 'youtube') {
      const videoId = getYouTubeID(media?.url);
      return (
        <View style={styles.mediaWrapper}>
          <YoutubePlayer
            height={280}
            play={true} // Otomatis putar setelah thumbnail diklik
            videoId={videoId || ""}
            onChangeState={onStateChange}
          />
        </View>
      );
    }

    // Render Video Lokal/Direct URL menggunakan expo-av
    if (media?.type === 'video') {
      return (
        <Video
          source={{ uri: media.url }}
          style={styles.image}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
        />
      );
    }

    // Default: Render Image
    return <Image source={{ uri: media?.url }} style={styles.image} contentFit="cover" />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.mediaContainer}>
          {renderMedia()}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.categoryBadge}>
             <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
          
          <Text style={styles.desc}>{recipe.description}</Text>
          <View style={styles.divider} />

          <Text style={styles.subTitle}>Bahan-bahan</Text>
          {recipe.ingredients?.map((ing: string, i: number) => (
            <Text key={i} style={styles.listItem}>• {ing}</Text>
          ))}

          <Text style={styles.subTitle}>Cara Membuat</Text>
          {recipe.steps?.map((step: string, i: number) => (
            <View key={i} style={styles.stepBox}>
              <View style={styles.stepNumWrapper}>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mediaContainer: { position: 'relative', backgroundColor: '#000', minHeight: 280 },
  mediaWrapper: { width: SCREEN_WIDTH, height: 280 },
  image: { width: '100%', height: 280 },
  playOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.3)' 
  },
  backBtn: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 10, 
    borderRadius: 15,
    zIndex: 10 
  },
  content: { 
    padding: 25, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    marginTop: -30 
  },
  title: { fontSize: 26, fontWeight: '900', color: '#111', marginBottom: 10 },
  categoryBadge: { 
    backgroundColor: '#FFF5ED', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10, 
    alignSelf: 'flex-start',
    marginBottom: 15
  },
  categoryText: { color: '#FF7A00', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  desc: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  subTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, color: '#111' },
  listItem: { fontSize: 16, marginBottom: 10, color: '#444', lineHeight: 22 },
  stepBox: { flexDirection: 'row', marginBottom: 20, gap: 15, alignItems: 'flex-start' },
  stepNumWrapper: { 
    width: 32, 
    height: 32, 
    backgroundColor: '#FF7A00', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  stepNum: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  stepText: { flex: 1, fontSize: 16, color: '#333', lineHeight: 24 },
});