// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Tab Layout
// Expo Router v4 - Bottom Tab Navigation
// ============================================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  gold: '#D4AF37',
  inactive: '#808080',
  background: '#000000',
  tabBackground: '#0D0D0D',
  border: '#1A1A1A',
};

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
};

function TabIcon({ name, color, focused }: TabIconProps) {
  return (
    <Ionicons
      name={name}
      size={focused ? 26 : 24}
      color={color}
      style={{ opacity: focused ? 1 : 0.7 }}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.tabBackground,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "L'Atelier",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="flask" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cava"
        options={{
          title: 'La Cava',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="wine" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bibliotheque"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="library" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="lenez"
        options={{
          title: 'Le Nez',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="scan" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="heritage"
        options={{
          title: 'Héritage',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="time" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="reglages"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
