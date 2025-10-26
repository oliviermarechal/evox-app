import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width, height } = Dimensions.get('window');

export default function PRsScreen() {
  // Force portrait orientation for PRs screen
  useScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Background Elements */}
        <View style={styles.backgroundElements}>
          <View style={[styles.floatingElement, styles.element1]} />
          <View style={[styles.floatingElement, styles.element2]} />
          <View style={[styles.floatingElement, styles.element3]} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <FontAwesome name="trophy" size={80} color="#87CEEB" />
            <View style={styles.iconGlow} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Personal Records</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Track your best lifts and times
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            Monitor your progress, celebrate achievements, and push your limits with detailed PR tracking.
          </Text>

          {/* Coming Soon Badge */}
          <View style={styles.comingSoonBadge}>
            <View style={styles.badgeContent}>
              <FontAwesome name="rocket" size={16} color="#87CEEB" />
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>
            <View style={styles.badgeGlow} />
          </View>

          {/* Features Preview */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <FontAwesome name="chart-line" size={20} color="rgba(135, 206, 235, 0.8)" />
              <Text style={styles.featureText}>Progress Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="trophy" size={20} color="rgba(135, 206, 235, 0.8)" />
              <Text style={styles.featureText}>Achievement Badges</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="history" size={20} color="rgba(135, 206, 235, 0.8)" />
              <Text style={styles.featureText}>Historical Data</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F10',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderRadius: 50,
  },
  element1: {
    width: 100,
    height: 100,
    top: height * 0.1,
    right: width * 0.1,
  },
  element2: {
    width: 60,
    height: 60,
    top: height * 0.3,
    left: width * 0.15,
  },
  element3: {
    width: 80,
    height: 80,
    bottom: height * 0.2,
    right: width * 0.2,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  iconGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(135, 206, 235, 0.2)',
    borderRadius: 50,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F5F5DC',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(135, 206, 235, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: 'rgba(245, 245, 220, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 300,
  },
  comingSoonBadge: {
    position: 'relative',
    marginBottom: 48,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.3)',
  },
  badgeText: {
    color: '#87CEEB',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 1,
  },
  badgeGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderRadius: 27,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 206, 235, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.2)',
    minWidth: 120,
    justifyContent: 'center',
  },
  featureText: {
    color: 'rgba(135, 206, 235, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});