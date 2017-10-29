"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ID = 10000000;
/**
 * Subscriber.
 */
var Subscriber = (function () {
    function Subscriber(stream, onData, onError, onComplete) {
        this._id = String(ID++);
        this._onComplete = onComplete;
        this._onError = onError;
        this._onData = onData;
        this._stream = stream;
    }
    Object.defineProperty(Subscriber.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscriber.prototype, "stream", {
        get: function () {
            return this._stream;
        },
        enumerable: true,
        configurable: true
    });
    Subscriber.prototype.unsubscribe = function () {
        if (this._stream) {
            var stream = this._stream;
            this._middleware = this._stream = null;
            stream.unsubscribe(this);
        }
        return this;
    };
    // middlewares
    Subscriber.prototype.once = function () {
        this._middleware = this.unsubscribe.bind(this);
        return this;
    };
    // handlers
    Subscriber.prototype.doComplete = function () {
        this._processMiddleware();
        if (this._onComplete) {
            this._onComplete();
        }
        return this;
    };
    Subscriber.prototype.doData = function (data) {
        data = this._processMiddleware(data);
        if (this._onData) {
            this._onData(data);
        }
        return this;
    };
    Subscriber.prototype.doError = function (error) {
        this._processMiddleware(error);
        if (this._onError) {
            this._onError(error);
        }
        return this;
    };
    Subscriber.prototype._processMiddleware = function (data) {
        if (this._middleware) {
            this._middleware();
        }
        return data;
    };
    return Subscriber;
}());
exports.Subscriber = Subscriber;
