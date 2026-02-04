const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Añadir soporte para NativeWind
const nativeWindConfig = withNativeWind(config, {
  input: './src/styles/globals.css',
});

// Configuración adicional
module.exports = {
  ...nativeWindConfig,
  resolver: {
    ...nativeWindConfig.resolver,
    extraNodeModules: {
      ...nativeWindConfig.resolver.extraNodeModules,
    },
  },
  transformer: {
    ...nativeWindConfig.transformer,
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
  },
};
