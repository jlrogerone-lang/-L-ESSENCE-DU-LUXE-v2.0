// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Babel Configuration
// Expo SDK 52 + NativeWind v4 + Reanimated 3
// ============================================================================

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      // NativeWind v4 - must come before reanimated
      'nativewind/babel',

      // Module resolver for path aliases
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@app': './app',
            '@contexts': './src/contexts',
            '@services': './src/services',
            '@screens': './src/screens',
            '@components': './src/components',
            '@types': './src/types',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@styles': './src/styles',
            '@data': './src/data',
            '@assets': './assets',
          },
        },
      ],

      // Reanimated - MUST be last
      'react-native-reanimated/plugin',
    ],
  };
};
