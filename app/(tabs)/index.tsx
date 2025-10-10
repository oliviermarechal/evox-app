import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import SportCard from '@/components/SportCard';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        {/* Dynamic Sport Header */}
        <View style={{ paddingTop: 24, paddingBottom: 32 }}>
          <View style={{ 
            backgroundColor: '#FFD70020', 
            borderRadius: 20, 
            paddingHorizontal: 24, 
            paddingVertical: 16, 
            borderWidth: 2, 
            borderColor: '#FFD70040', 
            marginBottom: 16 
          }}>
            <Text style={{ color: '#FFD700', fontSize: 32, fontWeight: 'bold', textAlign: 'center', letterSpacing: 2 }}>
              EVOX
            </Text>
            <Text style={{ color: '#87CEEB', fontSize: 16, textAlign: 'center', marginTop: 4, letterSpacing: 1 }}>
              CrossFit • Hyrox • Training
            </Text>
          </View>
        </View>

        {/* Timers Grid */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: 24,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <SportCard
              title="FREE"
              subtitle="Stopwatch"
              iconName="play"
              onPress={() => router.push('/timers/free')}
            />
            <SportCard
              title="FOR TIME"
              subtitle="Set target time"
              iconName="clock-o"
              onPress={() => router.push('/timers/fortime' as any)}
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
              onPress={() => router.push('/timers/amrap' as any)}
            />
            <SportCard
              title="TABATA"
              subtitle="High Intensity Interval"
              iconName="bolt"
              onPress={() => router.push('/timers/tabata' as any)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
