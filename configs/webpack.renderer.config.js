const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: path.resolve(__dirname, '../src/renderer/index.tsx'),

  devtool: 'inline-source-map',

  output: {
    path: path.resolve(__dirname, '../build'),
    filename: isProduction ? '[name].[hash].js' : 'index.js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    require('tailwindcss')(require('./tailwind.config')),
                    require('autoprefixer'),
                  ],
                ],
              },
            },
          },
        ],
      },

      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        loader: 'url-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
          esModule: false,
        },
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/renderer/public/index.html'),
    }),
  ],

  target: 'electron-renderer',

  mode: isProduction ? 'production' : 'development',

  devServer: {
    contentBase: path.resolve(__dirname, '../build/renderer'),
    port: 3000,
    historyApiFallback: true,
  },
}
