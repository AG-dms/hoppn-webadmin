const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const FontPreloadPlugin = require('webpack-font-preload-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (_, args) => {
  const mode = args.mode || 'development';
  const isProduction = mode === 'production';

  const defaultConfig = {
    mode,
    target: 'web',
    entry: './src/index.tsx',
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
      alias: {
        '@': ['./src/'],
        '@components': path.resolve(__dirname, 'src/components'),
        '@store': path.resolve(__dirname, 'src/store/'),
        '@routes': path.resolve(__dirname, 'src/routes/'),
        '@image': path.resolve(__dirname, 'src/image/'),
        '@locales': path.resolve(__dirname, 'src/locales/'),
        '@scenes': path.resolve(__dirname, 'src/scenes/'),
        '@utils': path.resolve(__dirname, 'src/utils/'),
        '@styles': path.resolve(__dirname, 'src/styles/'),
      },
    },
    module: {
      rules: [
        {
          test: /fonts[\\/].*\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },

        {
          test: /\.svg$/,
          use: [{ loader: 'svg-url-loader' }],
        },

        {
          test: /\.(png|jpe?g|svg|gif)$/i,
          type: 'asset/resource',
        },

        {
          test: /\.(webp)$/i,
          use: ['file-loader', 'webp-loader'],
        },

        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheCompression: false,
                cacheDirectory: true,
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          exclude: '/node_modules/',
        },

        {
          test: /\.css$/i,
          use: [
            MiniCSSExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },

        {
          test: /\.s[ac]ss$/i,
          exclude: /\.module\.s[ac]ss$/i,
          use: [
            MiniCSSExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: true } },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                implementation: require('sass'),
              },
            },
          ],
        },

        {
          test: /\.module\.s[ac]ss$/i,
          use: [
            MiniCSSExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                },
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                implementation: require('sass'),
              },
            },
          ],
        },
      ],
    },

    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'public'),
          publicPath: '/',
        },
      ],
      hot: true,
      port: 8085,
      historyApiFallback: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },

    output: {
      hashFunction: 'xxhash64',
      filename: '[name]-[contenthash].js',
      chunkFilename: '[name]-[contenthash].js',
      path: path.resolve(__dirname, 'public', 'dist'),
      publicPath: '/',
      clean: true,
    },

    plugins: [
      new Dotenv(),
      new NodePolyfillPlugin(),
      new FontPreloadPlugin(),
      new HTMLWebPackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        favicon: './src/image/fav.png',
      }),
      new MiniCSSExtractPlugin({
        filename: '[name]-[contenthash].css',
        chunkFilename: '[name]-[contenthash].css',
      }),
      new RobotstxtPlugin({
        filePath: './robots.txt',
      }),
    ],
  };

  const productionConfig = {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          test: /\.js(\?.*)?$/i,
          extractComments: true,
          terserOptions: {
            sourceMap: true,
          },
        }),
        new CSSMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            sourceMap: true,
          },
        }),
      ],
      splitChunks: {
        chunks: 'async',
        minSize: 200000,
        minRemainingSize: 0,
        maxSize: 400000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };

  const config = isProduction
    ? {
        ...defaultConfig,
        ...productionConfig,
      }
    : {
        ...defaultConfig,
      };

  return config;
};
