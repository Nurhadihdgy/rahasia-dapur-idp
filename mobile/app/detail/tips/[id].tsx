import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Eye, Heart, PlayCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { useAuthContext } from '../../../context/AuthContext';
import { useTips } from '../../../hooks/useTips';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TipsDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { tip, fetchTipById, toggleLikeTip, loading } = useTips();
  const { user, isAuthenticated } = useAuthContext();
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (typeof id === 'string') fetchTipById(id);
  }, [id]);

  useEffect(() => {
    if (tip) {
      setLikesCount(tip.likesCount || 0);
      setIsLiked(tip.likes?.includes(user?._id));
    }
  }, [tip, user]);

  const getYouTubeID = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;
    
    // Optimistic Update
    const prevLiked = isLiked;
    const prevCount = likesCount;
    
    setIsLiked(!prevLiked);
    setLikesCount(prev => prevLiked ? prev - 1 : prev + 1);

    try {
      // Endpoint yang dipanggil melalui tipsService adalah /tips/:id/like
      await toggleLikeTip(tip._id);
    } catch (err) {
      // Revert jika gagal
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const renderMedia = () => {
    const media = tip.media;
    if (!media) return null;

    // Tampilkan Thumbnail sebelum Play untuk Video/YouTube
    if (!showVideo && (media.type === 'youtube' || media.type === 'video')) {
      return (
        <TouchableOpacity style={styles.image} onPress={() => setShowVideo(true)}>
          <Image 
            source={{ uri: media.thumbnail || media.url }} 
            style={styles.image} 
            contentFit="cover" 
          />
          <View style={styles.playOverlay}>
            <PlayCircle size={60} color="white" />
          </View>
        </TouchableOpacity>
      );
    }

    if (media.type === 'youtube') {
      const videoId = getYouTubeID(media.url);
      return (
        <View style={styles.mediaWrapper}>
          <YoutubePlayer
            height={250}
            play={true}
            videoId={videoId || ""}
          />
        </View>
      );
    }

    if (media.type === 'video') {
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

    return <Image source={{ uri: media.url }} style={styles.image} contentFit="cover" />;
  };

  if (loading || !tip) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#FF7A00" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mediaContainer}>
          {renderMedia()}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{tip.title}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Eye size={18} color="#FF7A00" />
              <Text style={styles.statText}>{tip.views || 0} Views</Text>
            </View>
            <TouchableOpacity 
              style={[styles.stat, isLiked && styles.statLiked]} 
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Heart 
                size={18} 
                color={isLiked ? "#FF4B4B" : "#999"} 
                fill={isLiked ? "#FF4B4B" : "none"} 
              />
              <Text style={[styles.statText, isLiked && { color: '#FF4B4B' }]}>
                {likesCount} Suka
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descBox}>
            <Text style={styles.descTitle}>💡 Cara Melakukan:</Text>
            <Text style={styles.description}>{tip.description}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mediaContainer: { height: 250, backgroundColor: '#000', position: 'relative' },
  mediaWrapper: { width: SCREEN_WIDTH, height: 250 },
  image: { width: '100%', height: '100%' },
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
    marginTop: -30, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35,
    minHeight: 500
  },
  title: { fontSize: 26, fontVariant: ['small-caps'], fontWeight: '900', color: '#111', marginBottom: 15 },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  stat: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#F5F5F5', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12 
  },
  statLiked: { backgroundColor: '#FFF0F0' },
  statText: { fontWeight: '700', color: '#666', fontSize: 13 },
  descBox: { 
    backgroundColor: '#FDF6F0', 
    padding: 20, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: '#F0E0D0' 
  },
  descTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF7A00', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 26, color: '#444' }
});