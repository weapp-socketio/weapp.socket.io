![logo](https://avatars0.githubusercontent.com/u/24429466?s=100&u=031180a39da9253ac73d782dabb27d46cf828e37&v=4)
<img src="https://avatars3.githubusercontent.com/u/18544015?s=100&u=2ef4c96445ee5cc3b9b4b9817666287f85b77068&v=4" style="border-radius: 50%" />

# 合作伙伴征集
如果你的项目正在使用 [weapp.socket.io](https://github.com/weapp-socketio/weapp.socket.io) 欢迎留下你的项目信息（名称，Logo，官网等）

> 可以在 [这个 Issue](https://github.com/weapp-socketio/weapp.socket.io/issues/13) 提交您的项目信息

# weapp.socket.io

See [Weapp demo](https://github.com/wxsocketio/socket.io-weapp-demo)

## Feature

Full feature socket.io style implemented (polling & websocket), based-on `socket.io@2.0` version

> Note: weapp's http request not support binary, so you can't transport binary data use polling.
> Not support multiple connection for now, please wait next version :)

> removed polling transport

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

# TODO

- AliPay mini program
