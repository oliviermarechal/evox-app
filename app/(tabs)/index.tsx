import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import SportCard from '@/components/home/SportCard';
import { useOrientation } from '@/hooks/useOrientation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function HomeScreen() {
  const { isLandscape } = useOrientation();
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Background avec gradient subtil */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0F0F10',
      }}>
        {/* Gradient overlay subtil */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(135, 206, 235, 0.02)',
        }} />
      </View>

      {/* Header Premium */}
      <View style={{ 
        paddingHorizontal: 32, 
        paddingVertical: 24,
        alignItems: 'center',
        zIndex: 10
      }}>
        <Text style={{ 
          color: '#F5F5DC', 
          fontSize: 48, 
          fontWeight: '900', 
          textAlign: 'center', 
          letterSpacing: 4,
          textShadowColor: 'rgba(245, 245, 220, 0.3)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 20,
          marginBottom: 8
        }}>
          EVOX
        </Text>
        <Text style={{ 
          color: 'rgba(135, 206, 235, 0.8)', 
          fontSize: 16, 
          textAlign: 'center', 
          letterSpacing: 2,
          textShadowColor: 'rgba(135, 206, 235, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 4,
          textTransform: 'uppercase',
          fontWeight: '500'
        }}>
          CrossFit • Hyrox • Training
        </Text>
      </View>

      {/* Timers Grid Premium */}
      <View style={{ 
        flex: 1, 
        paddingHorizontal: 24, 
        paddingVertical: 16,
        justifyContent: 'center',
        zIndex: 5
      }}>
        <View style={{ 
          flexDirection: isLandscape ? 'row' : 'row', 
          flexWrap: 'wrap',
          gap: isLandscape ? 16 : 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <SportCard
            title="FREE TIMER"
            subtitle="Stopwatch"
            iconName="play"
            onPress={() => router.push('/timers/free')}
          />
          <SportCard
            title="FOR TIME"
            subtitle="Set target time"
            iconName="clock-o"
            onPress={() => router.push('/timers/fortime')}
          />
          <SportCard
            title="EMOM"
            subtitle="Every Minute On the Minute"
            iconName="clock-o"
            onPress={() => router.push('/timers/emom')}
          />
          <SportCard
            title="AMRAP"
            subtitle="As Many Rounds As Possible"
            iconName="repeat"
            onPress={() => router.push('/timers/amrap')}
          />
          <SportCard
            title="TABATA"
            subtitle="High Intensity Interval"
            iconName="bolt"
            onPress={() => router.push('/timers/tabata')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
