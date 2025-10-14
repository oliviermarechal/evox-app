import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useOrientation } from '@/hooks/useOrientation';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLandscape } = useOrientation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#87CEEB',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#0F0F10',
          borderTopColor: '#333',
        },
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: !isLandscape, // Hide labels in landscape
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <TabBarIcon name="repeat" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="prs"
        options={{
          title: 'PRs',
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
