import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111827' : '#F7F7F2',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
        },
        sceneStyle: {
          backgroundColor: colorScheme === 'dark' ? '#050816' : '#F7F7F2',
        },
        tabBarStyle: {
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wardrobe',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'square.grid.2x2.fill',
                android: 'grid_view',
                web: 'grid_view',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Add Item',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'camera.fill',
                android: 'photo_camera',
                web: 'photo_camera',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="try-on"
        options={{
          title: 'Try-On',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'person.crop.rectangle.stack.fill',
                android: 'checkroom',
                web: 'checkroom',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Suggestions',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'sparkles',
                android: 'auto_awesome',
                web: 'auto_awesome',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
