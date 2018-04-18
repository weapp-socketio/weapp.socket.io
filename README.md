# weapp.socket.io

See [Weapp demo](https://github.com/wxsocketio/socket.io-weapp-demo)

## Feature

Full feature socket.io style implemented (polling & websocket)

> weapp's http request not support binary, so you can't transport binary data use polling.

## How to use

### Compiled

```
npm run build-dev
npm run build
```

if you use `yarn`

```
yarn build-dev
yarn build
```

### Import yout weapp project

1.  move your compiled file in your `dist` dir
2.  require this filr in your code.

### example code

code style is same to [socket.io-client](https://github.com/socketio/socket.io-client)

```
const io = require('./yout_path/weapp.socket.io.js')

const socket = io('http://localhost:8000')

socket.on('news', d => {
  console.log('received news: ', d)
})

socket.emit('news', {
  title: 'this is a news'
})
```

# API

See [socket.io-client API](https://github.com/socketio/socket.io-client/blob/master/docs/API.md)
