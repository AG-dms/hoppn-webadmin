module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@': ['./src'],
          '@components': ['./src/components'],
          '@store': ['./src/store'],
          '@scenes': ['./src/scenes'],
          '@routes': ['./src/routes'],
          '@utils': ['./src/utils'],
          '@styles': ['./src/styles'],
          '@image': ['./src/image'],
          '@locales': ['./src/locales'],
          '@app': ['./src/app'],
        },
      },
    ],
  ],
};
