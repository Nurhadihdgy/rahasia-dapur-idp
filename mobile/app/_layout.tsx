import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Provider yang telah dibuat
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      {/* StatusBar dikunci ke style "dark" agar ikon (jam, baterai) berwarna hitam di atas bg putih */}
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={true} />
      
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="detail/recipe/[id]" options={{ presentation: 'card' }} />
              <Stack.Screen name="detail/tips/[id]" options={{ presentation: 'card' }} />
              
              {/* Tambahkan rute untuk halaman profil agar memiliki animasi card */}
              <Stack.Screen name="profile/EditProfile" options={{ presentation: 'modal', headerShown: true, title: 'Ubah Profil' }} />
              <Stack.Screen name="profile/ChangePassword" options={{ presentation: 'modal', headerShown: true, title: 'Ubah Password' }} />
            </Stack>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}