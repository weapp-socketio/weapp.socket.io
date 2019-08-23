const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'weapp.socket.io.dev.js',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/debug/g, process.cwd() + '/support/debug.js'),
    new webpack.NormalModuleReplacementPlugin(/^ws$/g, process.cwd() + '/src/wx-ws.js'),
    new webpack.NormalModuleReplacementPlugin(/^.\/transports\/index$/g, process.cwd() + '/src/transport.js'),
  ],
  module: {
    rules: [{
      test: /engine.io-client\/lib\/socket.js$/,
      loader: 'string-replace-loader',
      options: {
        multiple: [{
          search: '["polling", "websocket"]',
          replace: '["websocket"]',
        }, {
          search: "['polling', 'websocket']",
          replace: "['websocket']",
        }]
      }
    }]
  }
};