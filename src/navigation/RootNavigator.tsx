// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Root Navigator
// 6 Tab Navigation (Atelier, Cava, Bibliotheque, LeNez, Heritage, Reglages)
// ============================================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { RootTabParamList } from '../types';
import { COLORS } from '../styles/colors';

import { AtelierScreen } from '../screens/AtelierScreen';
import { CavaScreen } from '../screens/CavaScreen';
import { BibliothequeScreen } from '../screens/BibliothequeScreen';
import { LeNezScreen } from '../screens/LeNezScreen';
import { HeritageScreen } from '../screens/HeritageScreen';
import { ReglagesScreen } from '../screens/ReglagesScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_CONFIG = [
  { name: 'Atelier' as const, component: AtelierScreen, icon: '🏛️', label: 'Atelier' },
  { name: 'Cava' as const, component: CavaScreen, icon: '🏺', label: 'Cava' },
  { name: 'Bibliotheque' as const, component: BibliothequeScreen, icon: '📚', label: 'Biblio' },
  { name: 'LeNez' as const, component: LeNezScreen, icon: '🧠', label: 'Le Nez' },
  { name: 'Heritage' as const, component: HeritageScreen, icon: '📖', label: 'Heritage' },
  { name: 'Reglages' as const, component: ReglagesScreen, icon: '⚙️', label: 'Reglages' },
];

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.dark.tabBarActive,
        tabBarInactiveTintColor: COLORS.dark.tabBarInactive,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ focused }) => (
              <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                {tab.icon}
              </Text>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.dark.tabBar,
    borderTopWidth: 1,
    borderTopColor: COLORS.dark.border,
    height: 65,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
});

export default RootNavigator;
