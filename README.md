<p align="center">
  <img src="https://avatars0.githubusercontent.com/u/24429466?s=200&u=031180a39da9253ac73d782dabb27d46cf828e37&v=4">
</p>
<p align="center">
  A WebSocket client for building WeChat Mini Program implement by <a href="https://socket.io/">socket.io</a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/weapp.socket.io">
    <img src="https://img.shields.io/badge/npm-2.0.1-brightgreen.svg">
  </a>

  <a href="https://github.com/10cella/weapp.socket.io/network">
    <img src="https://img.shields.io/github/forks/10cella/weapp.socket.io.svg">
  </a>  
  
  <a href="https://github.com/10cella/weapp.socket.io/stargazers">
    <img src="https://img.shields.io/github/stars/10cella/weapp.socket.io.svg">
  </a>  
  
  <a href="https://github.com/10cella/weapp.socket.io/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/10cella/weapp.socket.io.svg">
  </a>

  <a href="https://github.com/10cella/weapp.socket.io/issues">
    <img src="https://img.shields.io/github/issues/10cella/weapp.socket.io.svg">
  </a>
</p>


# Feature

Full feature socket.io style implemented, based-on `socket.io@2.x` version, such as:
- send message queue
- auto reconnect
- ping, pong
- room, namespaces

# Demos

[Official Framework](https://github.com/wxsocketio/socket.io-weapp-demo) , [Wepy Framework](https://github.com/weapp-socketio/wepy-demo-socket.io)

# Install

If you use a third-party framework such as [wepy](https://github.com/Tencent/wepy), you should install via `npm`

```
$ npm install weapp.socket.io
```

Or if you use the native way to write code，I recommend using `git clone`

```
$ git clone https://github.com/10cella/weapp.socket.io

# development mode
$ npm run build-dev

# production mode
$ npm run build

$ cp path/weapp.socket.io/dist/weapp.socket.io.js path/your_weapp_dir
```

# Usage

code style is same to [socket.io-client](https://github.com/socketio/socket.io-client)

```
const io = require('./yout_path/weapp.socket.io.js')

const socket = io('https://socket-io-chat.now.sh')

socket.on('connect', () => {
  console.log('connection created.')
});

socket.on('new message', d => {
  const {
    username,
    message
  } = d;
  console.log('received: ', username, message)
});

socket.emit('add user', "Jack");
```

# API

See [socket.io-client API](https://github.com/socketio/socket.io-client/blob/master/docs/API.md)

# TODO

- AliPay Mini Program
- Lark(飞书) Mini Promram

# 用户信息征集

如果你的项目正在使用 [weapp.socket.io](https://github.com/weapp-socketio/weapp.socket.io) 欢迎留下你的项目信息（名称，Logo，官网等）

> 可以在 [这个 Issue](https://github.com/weapp-socketio/weapp.socket.io/issues/13) 提交您的项目信息
