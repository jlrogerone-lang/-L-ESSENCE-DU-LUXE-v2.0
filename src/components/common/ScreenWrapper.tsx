// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Screen Wrapper
// ============================================================================

import React, { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from '../../styles/colors';

interface ScreenWrapperProps {
  children: ReactNode;
  padded?: boolean;
}

export function ScreenWrapper({ children, padded = true }: ScreenWrapperProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.background} />
      <View style={[styles.container, padded && styles.padded]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.dark.background,
  },
  padded: {
    paddingHorizontal: 16,
  },
});

export default ScreenWrapper;
