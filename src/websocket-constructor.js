module.exports = {
  WebSocket: require('ws'),
  usingBrowserWebSocket: false,
  defaultBinaryType: 'nodebuffer',
  nextTick: (fn) => {setTimeout(() => { fn() }), 0}
};
