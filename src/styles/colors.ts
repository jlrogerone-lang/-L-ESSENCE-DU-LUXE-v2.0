// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Color Palette (OLED Optimized)
// ============================================================================

export const COLORS = {
  dark: {
    background: '#000000',
    surface: '#1A1A1A',
    surfaceElevated: '#2D2D2D',
    card: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textMuted: '#808080',
    primary: '#D4AF37',
    primaryLight: '#E8CC6B',
    secondary: '#E5E4E2',
    accent: '#1E90FF',
    accentPurple: '#9370DB',
    success: '#2ECC71',
    error: '#E74C3C',
    warning: '#F39C12',
    border: '#333333',
    borderLight: '#444444',
    tabBar: '#0D0D0D',
    tabBarActive: '#D4AF37',
    tabBarInactive: '#808080',
    overlay: 'rgba(0, 0, 0, 0.7)',
    glassBg: 'rgba(26, 26, 26, 0.85)',
    goldGlow: 'rgba(212, 175, 55, 0.3)',
    platinumGlow: 'rgba(229, 228, 226, 0.2)',
  },
  light: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAFA',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    textMuted: '#999999',
    primary: '#D4AF37',
    primaryLight: '#E8CC6B',
    secondary: '#333333',
    accent: '#1E90FF',
    accentPurple: '#9370DB',
    success: '#2ECC71',
    error: '#E74C3C',
    warning: '#F39C12',
    border: '#E0E0E0',
    borderLight: '#EEEEEE',
    tabBar: '#FFFFFF',
    tabBarActive: '#D4AF37',
    tabBarInactive: '#999999',
    overlay: 'rgba(0, 0, 0, 0.4)',
    glassBg: 'rgba(255, 255, 255, 0.85)',
    goldGlow: 'rgba(212, 175, 55, 0.2)',
    platinumGlow: 'rgba(51, 51, 51, 0.1)',
  },
};

export type ThemeColors = typeof COLORS.dark;

export function getColors(isDark: boolean): ThemeColors {
  return isDark ? COLORS.dark : COLORS.light;
}

export default COLORS;
