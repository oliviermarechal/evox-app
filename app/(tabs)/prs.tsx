import { View, Text } from 'react-native';

export default function PRsScreen() {
  return (
    <View className="flex-1 bg-evox-bg items-center justify-center">
      <Text className="text-evox-text text-2xl font-bold">Personal Records</Text>
      <Text className="text-evox-text/70 text-center mt-4 px-8">
        Track your best lifts and times
      </Text>
    </View>
  );
}