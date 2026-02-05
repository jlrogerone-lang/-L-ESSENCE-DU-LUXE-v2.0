module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@contexts': './src/contexts',
            '@services': './src/services',
            '@screens': './src/screens',
            '@components': './src/components',
            '@types': './src/types',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@styles': './src/styles',
            '@data': './src/data',
            '@navigation': './src/navigation',
          },
        },
      ],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ],
  };
};