const EventEmitter = require('events')
const { URL } = require('url')
const { addEventListener, removeEventListener } = require('./event-target')
const Sender = require('./sender')

const debug = require('debug')('wx-ws:wx-ws')

const BINARY_TYPES = ['nodebuffer', 'arraybuffer']
const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']
const closeTimeout = 30 * 1000

/**
 * Class representing a WebSocket
 *
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
    constructor(address, protocols, options) {
        super()

        debug('constructor: ', address, protocols, options)

        this.readyState = WebSocket.CONNECTING
        this.protocol = ''
        this._closeCode = 1006
        this._closeMessage = ''

        this._binaryType = BINARY_TYPES[0]
        this._socket = null

        this.supports = {
            binary: true
        }

        if (address !== null) {
            this._bufferedAmount = 0
            this._redirects = 0

            if (typeof protocols === 'object' && protocols !== null) {
                options = protocols
                protocols = undefined
            }
            initAsClient(this, address, protocols, options)
        }
    }

    get CONNECTING() {
        return WebSocket.CONNECTING
    }
    get CLOSING() {
        return WebSocket.CLOSING
    }
    get CLOSED() {
        return WebSocket.CLOSED
    }
    get OPEN() {
        return WebSocket.OPEN
    }

    /**
     * @type {Number}
     */
    get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount

        //
        // `socket.bufferSize` is `undefined` if the socket is closed.
        //
        return (this._socket.bufferSize || 0) + this._sender._bufferedBytes
    }

    /**
     * This deviates from the WHATWG interface since ws doesn't support the
     * required default "blob" type (instead we define a custom "nodebuffer"
     * type).
     *
     * @type {String}
     */
    get binaryType() {
        return this._binaryType
    }
    set binaryType(type) {
        debug('set binaryType: ', type)
        if (!BINARY_TYPES.includes(type)) return

        this._binaryType = type
    }

    /**
     * Set up the socket and the internal resources.
     * WX WebSocket events to ws events
     *
     * @param {*} socket
     */
    setSocket(socket, head) {
        this._socket = socket
        this._sender = new Sender(socket)

        debug(
            'set socket: socket =',
            socket,
            ', head =',
            head,
            ', this: ',
            this
        )

        this._socket.onOpen((head) => {
            debug('socket onopen: ', head)
            this.readyState = WebSocket.OPEN
            this.emit('open', head)
        })
        this._socket.onClose((res) => {
            debug('socket onclose: ', res)
            this._closeCode = res.code
            this._closeMessage = res.reason
            this.emitClose()
        })
        this._socket.onError((errMsg) => {
            debug('socket onerror: ', errMsg)
            this.emit('error', errMsg)
        })
        this._socket.onMessage((msg) => {
            debug('socket onmessage: ', msg, this)
            this.emit('message', msg.data)
        })
    }
    /**
     * Emit the `'close'` event
     *
     * @private
     */
    emitClose() {
        this.readyState = WebSocket.CLOSED
        this.removeEventListener()
        this.emit('close', this._closeCode, this._closeMessage)
        return
    }

    /**
     * Send a data message.
     *
     * @param {*} data
     * @param {*} options
     * @param {*} cb
     */
    send(data, options, cb) {
        debug(
            'socket send msg: ',
            data,
            this.readyState,
            ', sender: ',
            this._sender
        )

        if (this.readyState === WebSocket.CONNECTING) {
            throw new Error('WebSocket is not open: readyState 0 (CONNECTING)')
        }

        if (typeof data === 'number') data = data.toString()

        if (this.readyState !== WebSocket.OPEN) {
            if (cb) {
                const err = new Error(
                    `WebSocket is not open: readyState ${this.readyState} ` +
                        `(${readyStates[this.readyState]})`
                )
                cb(err)
            }
            return
        }

        this._sender.send(data, options, cb)
    }
    /**
     * Closing connection.
     *
     * @param {*} code
     * @param {*} reason
     */
    close(code, reason) {
        debug('closing connection: ', this.readyState)

        if (this.readyState === WebSocket.CLOSED) return
        if (this.readyState === WebSocket.CONNECTING) {
            const msg =
                'WebSocket was closed before the connection was established'
            throw new Error(msg)
        }

        if (this.readyState === WebSocket.CLOSING) {
            return
        }

        this.readyState = WebSocket.CLOSING
        this._socket.close({
            code: code,
            reason: reason,
            success: () => {
                debug('connection closed...')
                this.readyState = WebSocket.CLOSED
                this._socket = null
            }
        })
    }
}

readyStates.forEach((readyState, i) => {
    WebSocket[readyState] = i
})

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
;['open', 'error', 'close', 'message'].forEach((method) => {
    Object.defineProperty(WebSocket.prototype, `on${method}`, {
        /**
         * Return the listener of the event.
         *
         * @return {(Function|undefined)} The event listener or `undefined`
         * @public
         */
        get() {
            const listeners = this.listeners(method)
            for (let i = 0; i < listeners.length; i++) {
                if (listeners[i]._listener) return listeners[i]._listener
            }

            return undefined
        },
        /**
         * Add a listener for the event.
         *
         * @param {Function} listener The listener to add
         * @public
         */
        set(listener) {
            const listeners = this.listeners(method)
            for (let i = 0; i < listeners.length; i++) {
                //
                // Remove only the listeners added via `addEventListener`.
                //
                if (listeners[i]._listener)
                    this.removeListener(method, listeners[i])
            }
            this.addEventListener(method, listener)
        }
    })
})

WebSocket.prototype.addEventListener = addEventListener
WebSocket.prototype.removeEventListener = removeEventListener

/**
 * Initialize a WebSocket client.
 *
 * @param {WebSocket} websocket The client to initialize
 * @param {(String|url.URL)} address The URL to which to connect
 * @param {Array<String>} protocols The subprotocols
 * @param {*} options
 */
function initAsClient(websocket, address, protocols, options) {
    const opts = {
        maxPayload: 100 * 1024 * 1024,
        perMessageDeflate: true,
        ...options
    }
    debug('initAsClient: opts: ', opts)

    websocket.url = address

    const socket = createConnection(
        {
            url: websocket.url,
            header: opts.headers,
            protocols: protocols,
            perMessageDeflate: opts.perMessageDeflate ? true : false,
            tcpNoDelay: opts.tcpNoDelay ? true : false
        },
        websocket
    )

    websocket.setSocket(socket)
}

/**
 *
 * @param {*} options
 * @param {*} websocket
 */
function createConnection(options, websocket) {
    debug('start create conn: ', options)

    const socketTask = wx.connectSocket(options)

    if (!!socketTask) {
        return socketTask
    }

    return {
        onClose: wx.onSocketClose,
        onOpen: wx.onSocketOpen,
        onError: wx.onSocketError,
        onMessage: wx.onSocketMessage,
        send: wx.sendSocketMessage,
        close: wx.closeSocket
    }
}

module.exports = WebSocket
