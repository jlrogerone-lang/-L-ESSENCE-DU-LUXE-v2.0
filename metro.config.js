// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Metro Configuration
// Expo SDK 52 + NativeWind v4
// ============================================================================

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configure source extensions
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');

// Add SVG transformer support (optional, for future use)
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'otf', 'png', 'jpg', 'jpeg', 'gif', 'webp');

// Resolver configuration for module aliases
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
  '@app': path.resolve(__dirname, 'app'),
  '@contexts': path.resolve(__dirname, 'src/contexts'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@styles': path.resolve(__dirname, 'src/styles'),
  '@data': path.resolve(__dirname, 'src/data'),
  '@assets': path.resolve(__dirname, 'assets'),
};

// Watch folders
config.watchFolders = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, 'app'),
  path.resolve(__dirname, 'assets'),
];

// Transformer optimizations
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Export with NativeWind support
module.exports = withNativeWind(config, {
  input: './src/styles/global.css',
  inlineRem: 16,
});
