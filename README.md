# weapp.socket.io

See [Weapp demo](https://github.com/wxsocketio/socket.io-weapp-demo)

## Feature

Full feature socket.io style implemented (polling & websocket), based-on `socket.io@2.0` version

> Note: weapp's http request not support binary, so you can't transport binary data use polling.
> Not support multiple connection for now, please wait next version :)

## How to use

### Install

```
  npm i weapp.socket.io
```

or

```
  git clone https://github.com/wxsocketio/weapp.socket.io.git
```

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
