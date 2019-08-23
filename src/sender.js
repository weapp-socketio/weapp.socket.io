const debug = require('debug')('wx-ws:sender');

/**
 * Sender
 */
class Sender {
    /**
     * Create a Sender instance
     * 
     * @param {*} socket The connection socket of wx
     */
    constructor(socket) {
        this._socket = socket;
        this._queue = []
        this._bufferedBytes = 0;
        this._deflating = false;
    }

    /**
     * Sends a data message to the other peer.
     * 
     * @param {*} data 
     * @param {*} options 
     * @param {*} cb 
     */
    send(data, options, cb) {
        debug("send msg: ", data, ' sender: ', this, this._deflating)
        if (this._deflating) {
            this.enqueue([this.dispatch, data, options, cb]);
        } else {
            this.dispatch(data, options, cb);
        }
    }


    /**
     * Dispatches a data message.
     * 
     * @param {*} data 
     * @param {*} options 
     * @param {*} cb 
     */
    dispatch(data, options, cb) {
        debug("dispatch msg: ", data, ', sender: ', this)

        this._deflating = true;

        if (typeof options === 'function') {
            cb = options;
            options = {};
        }

        this._deflating = false;
        this._socket.send({
            data: data,
            success: res => cb && cb(null, res),
            fail: err => cb && cb(err)
        })
        this.dequeue();
    }

    /**
     * Executes queued send operations.
     *
     * @private
     */
    dequeue() {
        while (!this._deflating && this._queue.length) {
            const params = this._queue.shift();

            this._bufferedBytes -= params[1].length;
            Reflect.apply(params[0], this, params.slice(1));
        }
    }

    /**
     * Enqueues a send operation.
     *
     * @param {Array} params Send operation parameters.
     * @private
     */
    enqueue(params) {
        this._bufferedBytes += params[1].length;
        this._queue.push(params);
    }
}
module.exports = Sender;