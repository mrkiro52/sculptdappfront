import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // For iOS, transparent background to show blur effect
            paddingTop: 10,
            paddingBottom: 10, // Optional: adjust padding if necessary
            height: 70, // Adjust the height to your preference
            display: 'flex',
            justifyContent: 'center', // Ensure icons are centered vertically
            alignItems: 'center', // Align icons horizontally if needed
            backgroundColor: '#121212', // обязательно
            elevation: 0, // убирает тень на Android
            borderTopWidth: 0,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          },
          default: {
              paddingTop: 10,
              paddingBottom: 10, // Optional: adjust padding if necessary
              height: 70, // Adjust the height to your preference
              display: 'flex',
              justifyContent: 'center', // Ensure icons are centered vertically
              alignItems: 'center', // Align icons horizontally if needed
              backgroundColor: 'transparent', // обязательно
              elevation: 0, // убирает тень на Android
              borderTopWidth: 0,
          },
        }),
        tabBarIconStyle: {
          marginBottom: 0, // Remove any extra space below the icon
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dumbbell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bubble.left.and.bubble.right.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
