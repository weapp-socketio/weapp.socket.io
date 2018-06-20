const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'weapp.socket.io.dev.js',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /debug/,
      process.cwd() + '/support/debug.js',
    ),
    new webpack.NormalModuleReplacementPlugin(/^engine.io-client$/, 'weapp.engine.io-client'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('lib')],
      },
    ],
  },
  mode: 'development',
}
