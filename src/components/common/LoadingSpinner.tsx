// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Loading Spinner
// ============================================================================

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export function LoadingSpinner({ message, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.dark.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark.background,
    padding: 20,
  },
  message: {
    color: COLORS.dark.textSecondary,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
