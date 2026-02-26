import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import { Home, Lightbulb, User, Utensils } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthContext } from '../../context/AuthContext';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuthContext();

  // Tunggu hingga AsyncStorage selesai memuat data
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </View>
    );
  }

  // JIKA TIDAK LOGIN: Lempar ke halaman login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#FF7A00', headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Beranda', tabBarIcon: ({color}) => <Home color={color} /> }} />
      <Tabs.Screen name="recipe" options={{ title: 'Resep', tabBarIcon: ({color}) => <Utensils color={color} /> }} />
      <Tabs.Screen name="tips" options={{ title: 'Tips', tabBarIcon: ({color}) => <Lightbulb color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({color}) => <User color={color} /> }} />
    </Tabs>
  );
}
