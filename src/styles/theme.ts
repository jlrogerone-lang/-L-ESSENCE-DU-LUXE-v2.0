// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Theme Configuration
// ============================================================================

import { COLORS } from './colors';

export const DarkNavigationTheme = {
  dark: true,
  colors: {
    primary: COLORS.dark.primary,
    background: COLORS.dark.background,
    card: COLORS.dark.tabBar,
    text: COLORS.dark.text,
    border: COLORS.dark.border,
    notification: COLORS.dark.error,
  },
};

export const LightNavigationTheme = {
  dark: false,
  colors: {
    primary: COLORS.light.primary,
    background: COLORS.light.background,
    card: COLORS.light.tabBar,
    text: COLORS.light.text,
    border: COLORS.light.border,
    notification: COLORS.light.error,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  title: 28,
  hero: 36,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
