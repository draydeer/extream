"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var deferred_1 = require("./deferred");
var stream_1 = require("./stream");
/**
 * Async wrapper with incoming and outgoing streams.
 */
var Executor = (function () {
    function Executor(asyncFactory) {
        var _this = this;
        this._incoming = new stream_1.Stream();
        this._outgoing = new stream_1.Stream();
        this._cancelled = new deferred_1.Deferred();
        var async = asyncFactory(this);
        if (false === async instanceof Promise) {
            throw new Error("Executor async factory must return async.");
        }
        this._async = async.then(function (result) {
            _this.complete();
            return result;
        }, function (error) {
            _this.complete();
            throw error;
        });
    }
    Object.defineProperty(Executor, "CANCELLED", {
        get: function () {
            return const_1.CANCELLED;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Executor.prototype, "async", {
        get: function () {
            return this._async;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "incoming", {
        get: function () {
            return this._incoming;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "isCancelled", {
        get: function () {
            return this._cancelled.isCompleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "outgoing", {
        get: function () {
            return this._outgoing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "promise", {
        get: function () {
            return this._async;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Generates Promise.all with scheduled executor cancellation so that on cancel rejects with CANCELLED.
     *
     * @param asyncs
     *
     * @returns {Promise<T[]>|any}
     */
    Executor.prototype.all = function (asyncs) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Promise.all(asyncs).then(resolve, reject);
            _this._cancelled.promise.catch(reject);
        });
    };
    /**
     * Completes executor closing incoming and outgoing streams.
     *
     * @returns {Executor}
     */
    Executor.prototype.complete = function () {
        this._incoming.complete();
        this._outgoing.complete();
        return this;
    };
    /**
     * Cancel executor rejecting cancelled deferred.
     */
    Executor.prototype.cancel = function () {
        this._cancelled.reject(const_1.CANCELLED);
        return this;
    };
    /**
     * Emits data to incoming stream.
     *
     * @param data
     *
     * @returns {Executor}
     */
    Executor.prototype.emit = function (data) {
        this._incoming.emit(data);
        return this;
    };
    /**
     * Generates Promise.race with scheduled executor cancellation so that on cancel rejects with CANCELLED.
     *
     * @param promises
     *
     * @returns {Promise<T>}
     */
    Executor.prototype.race = function (promises) {
        var promisesList = Array.from(promises);
        promisesList.push(this._cancelled.promise);
        return Promise.race(promisesList);
    };
    /**
     * Sends data to outgoing stream.
     *
     * @param data
     *
     * @returns {Executor}
     */
    Executor.prototype.send = function (data) {
        this._outgoing.emit(data);
        return this;
    };
    /**
     * Subscribes external executor streams.
     *
     * @param executor
     *
     * @returns {Executor}
     */
    Executor.prototype.subscribeExecutor = function (executor) {
        this.subscribeIncomingToStream(executor.incoming).subscribeStreamToOutgoing(executor.outgoing);
        return this;
    };
    /**
     * Subscribes internal incoming stream to some external so that external data will be redirected to it.
     *
     * @param stream
     *
     * @returns {Executor}
     */
    Executor.prototype.subscribeIncomingToStream = function (stream) {
        stream.subscribeStream(this._incoming);
        return this;
    };
    /**
     * Subscribes some external stream to internal outgoing so that internal data will be redirected to it.
     *
     * @param stream
     *
     * @returns {Executor}
     */
    Executor.prototype.subscribeStreamToOutgoing = function (stream) {
        this._outgoing.subscribeStream(stream);
        return this;
    };
    return Executor;
}());
exports.Executor = Executor;
