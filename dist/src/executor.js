"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deferred_1 = require("./deferred");
var stream_1 = require("./stream");
/**
 * Async deferred wrapper with incoming and outgoing streams.
 */
var Executor = (function () {
    function Executor(deferredFactory) {
        var _this = this;
        this._incoming = new stream_1.Stream();
        this._outgoing = new stream_1.Stream();
        this._cancelled = new deferred_1.Deferred();
        var deferred = deferredFactory(this);
        if (false === deferred instanceof Promise) {
            throw new Error("Executor factory must return async.");
        }
        this._deferred = deferred.then(function (result) {
            _this.complete();
            return result;
        }, function (error) {
            _this.complete();
            throw error;
        });
    }
    Object.defineProperty(Executor.prototype, "deferred", {
        get: function () {
            return this._deferred;
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
    Executor.prototype.complete = function () {
        this._cancelled.resolve();
        this._incoming.complete();
        this._outgoing.complete();
        return this;
    };
    Executor.prototype.subscribeExecutor = function (executor) {
        this.subscribeIncomingToStream(executor.incoming).subscribeStreamToOutgoing(executor.outgoing);
        return this;
    };
    Executor.prototype.subscribeIncomingToStream = function (stream) {
        stream.subscribeStream(this._incoming);
        return this;
    };
    Executor.prototype.subscribeStreamToOutgoing = function (stream) {
        this._outgoing.subscribeStream(stream);
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
    return Executor;
}());
exports.Executor = Executor;
