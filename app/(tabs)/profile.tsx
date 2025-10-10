import { View, Text } from 'react-native';


export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-evox-bg items-center justify-center">
      <Text className="text-evox-text text-2xl font-bold">Profile</Text>
      <Text className="text-evox-text/70 text-center mt-4 px-8">
        Manage your account and settings
      </Text>
    </View>
  );
}