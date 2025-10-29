import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1500);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="timers/free/index" options={{ headerShown: false }} />
        <Stack.Screen name="timers/fortime/index" options={{ headerShown: false }} />
        <Stack.Screen name="timers/emom/index" options={{ headerShown: false }} />
        <Stack.Screen name="timers/amrap/index" options={{ headerShown: false }} />
        <Stack.Screen name="timers/tabata/index" options={{ headerShown: false }} />
        <Stack.Screen name="workout-execution/[workoutId]" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
