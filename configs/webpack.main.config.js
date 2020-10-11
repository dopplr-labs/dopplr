const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: path.resolve(__dirname, '../src/main/index.ts'),

  devtool: isProduction ? 'inline-source-map' : undefined,

  output: {
    path: path.resolve(__dirname, '../build/main'),
    filename: 'index.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  target: 'electron-main',

  mode: isProduction ? 'production' : 'development',
}
