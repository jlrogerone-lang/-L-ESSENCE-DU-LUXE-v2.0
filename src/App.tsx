// ============================================================================
// L'ESSENCE DU LUXE v2.0 - App Entry Point
// Clean Architecture: Providers -> Navigation -> Screens
// All layers connected: Services -> Contexts -> Hooks -> UI
// ============================================================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { BibliothequeProvider } from './contexts/BibliothequeContext';
import { MonetizationProvider } from './contexts/MonetizationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { RootNavigator } from './navigation/RootNavigator';
import { DarkNavigationTheme } from './styles/theme';

export default function App() {
  return (
    <ErrorBoundary fallbackMessage="L'Essence du Luxe a rencontre une erreur. Veuillez redemarrer l'application.">
      <AuthProvider>
        <MonetizationProvider>
          <InventoryProvider>
            <BibliothequeProvider>
              <NavigationContainer theme={DarkNavigationTheme}>
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
