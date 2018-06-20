const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'weapp.socket.io.js',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /debug/,
      process.cwd() + '/support/noop.js',
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^engine.io-client$/,
      'weapp.engine.io-client',
    ),
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
  mode: 'production',
}
