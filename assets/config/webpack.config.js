const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
  src: path.resolve(__dirname, '..', 'src'),
  dist: path.resolve(__dirname, '..', 'dist'),
};

const config = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../fonts',
              useRelativePaths: true,
            },
          },
        ],
      },
      {
        test: /icons\/index\.js/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'webfonts-loader',
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../images',
              useRelativePaths: true,
            },
          },
        ],
        type: 'asset',
      },
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              'imagemin-gifsicle',
              'imagemin-mozjpeg',
              'imagemin-pngquant',
              'imagemin-svgo',
            ],
          },
        },
        generator: [
          {
            preset: 'webp',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ['imagemin-webp'],
            },
          },
        ],
      }),
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.entry = `${PATHS.src}/index.js`;
    config.devtool = 'source-map';
    config.output = {
      filename: 'site.js',
      path: `${PATHS.dist}/scripts`,
    };
    config.plugins = [
      new ESLintPlugin(),
      new MiniCssExtractPlugin({
        filename: '../styles/site.css',
      }),
    ];
  }

  if (argv.mode === 'production') {
    config.entry = `${PATHS.src}/index.js`;
    config.output = {
      filename: 'site.min.js',
      path: `${PATHS.dist}/scripts`,
    };
    config.plugins = [
      new ESLintPlugin(),
      new MiniCssExtractPlugin({
        filename: '../styles/site.min.css',
      }),
    ];
  }
  return config;
};
