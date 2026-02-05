// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Tailwind CSS Configuration
// NativeWind v4 preset for React Native
// ============================================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand Colors - L'Essence du Luxe
        'oled-black': '#000000',
        'luxe-gold': '#D4AF37',
        'luxe-gold-light': '#E8C963',
        'luxe-gold-dark': '#B8962F',
        'luxe-platinum': '#E5E4E2',
        'luxe-platinum-dark': '#C0BFBD',

        // Dark Theme
        'dark-charcoal': '#1A1A1A',
        'dark-gray': '#2D2D2D',
        'dark-elevated': '#3D3D3D',
        'dark-border': '#404040',

        // Light Theme
        'light-gray': '#F5F5F5',
        'light-elevated': '#FFFFFF',
        'light-border': '#E0E0E0',

        // Accent Colors
        'accent-blue': '#1E90FF',
        'accent-purple': '#9370DB',
        'accent-emerald': '#50C878',

        // Semantic Colors
        'success': '#2ECC71',
        'success-dark': '#27AE60',
        'error': '#E74C3C',
        'error-dark': '#C0392B',
        'warning': '#F39C12',
        'warning-dark': '#D68910',
        'info': '#3498DB',
        'info-dark': '#2980B9',

        // Text Colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'text-muted': '#808080',
        'text-inverse': '#000000',
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Menlo', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        'sm': ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'base': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        'lg': ['18px', { lineHeight: '28px', letterSpacing: '0px' }],
        'xl': ['20px', { lineHeight: '28px', letterSpacing: '0px' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.25px' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.5px' }],
        '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.75px' }],
        '5xl': ['48px', { lineHeight: '52px', letterSpacing: '-1px' }],
      },
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '5.5': '22px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'base': '0 2px 4px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.4)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.5)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.4)',
        'gold-intense': '0 0 40px rgba(212, 175, 55, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
