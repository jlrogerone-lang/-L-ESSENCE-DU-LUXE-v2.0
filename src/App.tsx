// ============================================================================
// L'ESSENCE DU LUXE v2.0 - App Entry Point
// Clean Architecture: Providers -> Navigation -> Screens
// All layers connected: Services -> Contexts -> Hooks -> UI
// ============================================================================

import React, { useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import { AuthProvider } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { BibliothequeProvider } from './contexts/BibliothequeContext';
import { MonetizationProvider } from './contexts/MonetizationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { RootNavigator } from './navigation/RootNavigator';
import { DarkNavigationTheme } from './styles/theme';

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts and other async resources
        await Font.loadAsync({
          // Add custom fonts here if needed
        });
      } catch (e) {
        console.warn('Error loading app resources:', e);
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
    <ErrorBoundary
      fallbackMessage="L'Essence du Luxe a rencontre une erreur. Veuillez redemarrer l'application."
    >
      <AuthProvider>
        <MonetizationProvider>
          <InventoryProvider>
            <BibliothequeProvider>
              <NavigationContainer theme={DarkNavigationTheme} onReady={onLayoutRootView}>
                <StatusBar style="light" />
                <RootNavigator />
              </NavigationContainer>
            </BibliothequeProvider>
          </InventoryProvider>
        </MonetizationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
