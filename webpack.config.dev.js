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
    new webpack.NormalModuleReplacementPlugin(/^.\/websocket-constructor$/g, process.cwd() + '/src/websocket-constructor.js'),
    new webpack.NormalModuleReplacementPlugin(/^.\/transports\/index$/g, process.cwd() + '/src/transport.js'),
    new webpack.NormalModuleReplacementPlugin(/^.\/util$/g, process.cwd() + '/src/util.js'),
    new webpack.NormalModuleReplacementPlugin(/^.\/engine.io-client\/lib\/util$/g, process.cwd() + '/src/util.js'),
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
    }, {
      test: /engine.io-client\/lib\/transports\/websocket.js$/,
      loader: 'string-replace-loader',
      options: {
        multiple: [{
          search: "typeof window === 'undefined'",
          replace: "typeof window === 'undefined' || typeof window !== 'undefined'",
        }]
      }
    }]
  }
};
