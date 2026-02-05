// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Root Layout
// Expo Router v4 - App Entry Point with Providers
// ============================================================================

import React, { useEffect, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from '@contexts/AuthContext';
import { MonetizationProvider } from '@contexts/MonetizationContext';
import { InventoryProvider } from '@contexts/InventoryContext';
import { BibliothequeProvider } from '@contexts/BibliothequeContext';

import '../src/styles/global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          // Custom fonts can be added here
        });
      } catch (error) {
        console.warn('Error loading app resources:', error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <MonetizationProvider>
          <InventoryProvider>
            <BibliothequeProvider>
              <View style={{ flex: 1, backgroundColor: '#000000' }}>
                <StatusBar style="light" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#000000' },
                    animation: 'fade',
                  }}
                >
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="perfume/[id]"
                    options={{
                      presentation: 'modal',
                      animation: 'slide_from_bottom',
                    }}
                  />
                </Stack>
              </View>
            </BibliothequeProvider>
          </InventoryProvider>
        </MonetizationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
