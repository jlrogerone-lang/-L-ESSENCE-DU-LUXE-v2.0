// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Card Component
// ============================================================================

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../styles/colors';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  style?: ViewStyle;
}

export function Card({ children, variant = 'default', style }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
  },
  default: {
    backgroundColor: COLORS.dark.surface,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  glass: {
    backgroundColor: COLORS.dark.glassBg,
    borderWidth: 1,
    borderColor: COLORS.dark.borderLight,
  },
  elevated: {
    backgroundColor: COLORS.dark.surfaceElevated,
    shadowColor: COLORS.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default Card;
