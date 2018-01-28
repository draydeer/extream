"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var stream_buffer_1 = require("./stream_buffer");
var subscriber_1 = require("./subscriber");
var singleElementPrebuffer = [[null, null]];
/**
 * Stream.
 */
var Stream = /** @class */ (function () {
    function Stream() {
        this._subscribers = {};
        this._subscribersCount = 0;
        this._transmittedCount = 0;
    }
    Object.defineProperty(Stream, "COMPLETED", {
        get: function () {
            return const_1.COMPLETED;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Stream.fromPromise = function (promise) {
        var stream = new Stream();
        promise.then(stream.emitAndComplete.bind(stream)).catch(stream.error.bind(stream));
        return stream;
    };
    Stream.merge = function () {
        var asyncs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            asyncs[_i] = arguments[_i];
        }
        var stream = new Stream();
        asyncs.forEach(function (async) {
            var mixedStream = async instanceof Promise ? Stream.fromPromise(async) : async;
            mixedStream.subscribeStream(stream);
        });
        return stream;
    };
    Object.defineProperty(Stream.prototype, "clone", {
        get: function () {
            return new Stream();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "isPaused", {
        get: function () {
            return this._isPaused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "lastValue", {
        get: function () {
            return this._lastValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "root", {
        get: function () {
            return this._root || this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "subscribersCount", {
        get: function () {
            return this._subscribersCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "transmittedCount", {
        get: function () {
            return this._transmittedCount;
        },
        enumerable: true,
        configurable: true
    });
    Stream.prototype.setRoot = function (stream) {
        if (stream !== this) {
            this._root = stream;
        }
        return this;
    };
    Stream.prototype.complete = function () {
        this._complete();
        return this;
    };
    Stream.prototype.complex = function () {
        this._isComplex = true;
        return this;
    };
    Stream.prototype.emit = function (data, subscribers) {
        this._emit(data, subscribers);
        return this;
    };
    Stream.prototype.emitAndComplete = function (data, subscribers) {
        //this._emit(data, subscribers).then(this.complete.bind(this));
        return this;
    };
    Stream.prototype.error = function (error) {
        this._subscriberOnError(error);
        return this;
    };
    Stream.prototype.fork = function () {
        var stream = this.clone;
        this.subscribeStream(stream);
        return stream.setRoot(this.root);
    };
    Stream.prototype.emptyLastValue = function () {
        this._isEmptyLastValue = true;
        return this;
    };
    Stream.prototype.pause = function () {
        this._isPaused = true;
        return this;
    };
    Stream.prototype.postbuffer = function (size) {
        if (size === void 0) { size = 10; }
        this._postbuffer = new stream_buffer_1.StreamBuffer(size);
        return this;
    };
    Stream.prototype.prebuffer = function (size) {
        if (size === void 0) { size = 10; }
        this._prebuffer = new stream_buffer_1.StreamBuffer(size);
        return this;
    };
    Stream.prototype.resume = function () {
        this._isPaused = false;
        return this;
    };
    Stream.prototype.simple = function () {
        this._isComplex = false;
        return this;
    };
    Stream.prototype.subscribe = function (onData, onError, onComplete) {
        return this._subscriberAdd(new subscriber_1.Subscriber(this, onData, onError, onComplete));
    };
    Stream.prototype.subscribeOnComplete = function (onComplete) {
        return this._subscriberAdd(new subscriber_1.Subscriber(this, void 0, void 0, onComplete));
    };
    Stream.prototype.subscribeStream = function (stream) {
        var subscription = this.subscribe(stream.emit.bind(stream), stream.error.bind(stream), stream.complete.bind(stream));
        stream.subscribeOnComplete(subscription.unsubscribe.bind(subscription));
        return subscription;
    };
    Stream.prototype.unsubscribe = function (subscriber) {
        return this._subscriberRemove(subscriber);
    };
    // middlewares
    Stream.prototype.debug = function (callback) {
        return this._middlewareAdd(function (data) {
            callback(data);
            return data;
        });
    };
    Stream.prototype.delay = function (milliseconds) {
        return this._middlewareAdd(function (data) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(data); }, milliseconds); }); });
    };
    Stream.prototype.dispatch = function () {
        var _this = this;
        return this._middlewareAdd(function (data) {
            _this._subscriberOnData(data);
            return data;
        });
    };
    Stream.prototype.exec = function (middleware) {
        return this._middlewareAdd(function (data, stream) {
            var result = middleware(data, stream);
            return result !== void 0 ? result : data;
        });
    };
    Stream.prototype.filter = function (middleware) {
        return this._middlewareAdd(middleware instanceof Function
            ? function (data, stream) { return middleware(data, stream) ? data : const_1.CANCELLED; }
            : function (data, stream) { return middleware === data ? data : const_1.CANCELLED; });
    };
    Stream.prototype.first = function () {
        var _this = this;
        this._middlewareAfterDispatchAdd(function (data) {
            _this.complete();
            return data;
        });
        return this;
    };
    Stream.prototype.map = function (middleware) {
        return this._middlewareAdd(middleware);
    };
    Stream.prototype.select = function (selector, streams) {
        return this._middlewareAdd(function (data) {
            var index = selector(data);
            if (index in streams) {
                return new Promise(function (resolve, reject) {
                    var subscriber = streams[index].subscribe(resolve, reject, function () { return reject(const_1.CANCELLED); }).isolated().once();
                    streams[index].root.emit(data, [subscriber]);
                });
            }
            throw new Error("\"select\" middleware got invalid index from selector: " + index);
        });
    };
    Stream.prototype.skip = function (middleware) {
        return this._middlewareAdd(middleware instanceof Function
            ? function (data, stream) { return middleware(data, stream) ? const_1.CANCELLED : data; }
            : function (data, stream) { return middleware === data ? const_1.CANCELLED : data; });
    };
    Stream.prototype.waitFor = function (stream) {
        return this._middlewareAdd(function (data) { return stream.emit(data).toPromise(); });
    };
    Stream.prototype.waitForCompletion = function (stream) {
        return this._middlewareAdd(function (data) { return stream.emit(data).toCompletionPromise(); });
    };
    Stream.prototype.waitForError = function (stream) {
        return this._middlewareAdd(function (data) { return stream.emit(data).toErrorPromise(); });
    };
    Stream.prototype.toCompletionPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.subscribe(void 0, reject, function () { return resolve(_this._lastValue); }).once();
        });
    };
    Stream.prototype.toErrorPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.subscribe(void 0, resolve, function () { return reject(const_1.COMPLETED); }).once();
        });
    };
    Stream.prototype.toPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.subscribe(resolve, reject, function () { return reject(const_1.COMPLETED); }).once();
        });
    };
    Stream.prototype._complete = function () {
        this._subscriberOnComplete();
        return this;
    };
    Stream.prototype._emit = function (data, subscribers) {
        if (this._prebuffer) {
            this._prebuffer.add([data, subscribers]);
            if (!this._emitLoopPromise) {
                //this._emitLoopPromise = this._emitLoop(this._prebuffer);
            }
            return this._emitLoopPromise;
        }
        singleElementPrebuffer[0][0] = data;
        singleElementPrebuffer[0][1] = subscribers;
        return this._emitLoop(singleElementPrebuffer);
    };
    Stream.prototype._emitLoop = function (prebuffer) {
        var temp;
        for (var _i = 0, prebuffer_1 = prebuffer; _i < prebuffer_1.length; _i++) {
            var _a = prebuffer_1[_i], data = _a[0], subscribers = _a[1];
            temp = data;
            if (this._isPaused) {
                break;
            }
            try {
                var cancelled = false;
                if (this._middlewares) {
                    for (var _b = 0, _c = this._middlewares; _b < _c.length; _b++) {
                        var middleware = _c[_b];
                        temp = middleware(temp, this);
                        if (temp instanceof Promise) {
                            //temp = await temp;
                        }
                        if (temp === const_1.CANCELLED) {
                            cancelled = true;
                            break;
                        }
                    }
                }
                if (cancelled) {
                    continue;
                }
                this._lastValue = temp;
                this._transmittedCount++;
                this._subscriberOnData(temp, subscribers);
                if (this._middlewaresAfterDispatch) {
                    for (var _d = 0, _e = this._middlewaresAfterDispatch; _d < _e.length; _d++) {
                        var middleware = _e[_d];
                        temp = middleware(temp, this);
                        if (temp instanceof Promise) {
                            //temp = await temp;
                        }
                        if (temp === const_1.CANCELLED) {
                            cancelled = true;
                            break;
                        }
                    }
                }
            }
            catch (error) {
                this._subscriberOnError(error);
            }
        }
        this._emitLoopPromise = null;
        return temp;
    };
    Stream.prototype._middlewareAdd = function (middleware) {
        if (this._middlewares === void 0) {
            this._middlewares = [];
        }
        this._middlewares.push(middleware);
        return this._isComplex ? this : this.fork();
    };
    Stream.prototype._middlewareAfterDispatchAdd = function (middleware) {
        if (this._middlewaresAfterDispatch === void 0) {
            this._middlewaresAfterDispatch = [];
        }
        this._middlewaresAfterDispatch.push(middleware);
        return middleware;
    };
    Stream.prototype._subscriberAdd = function (subscriber) {
        if (false === subscriber.id in this._subscribers) {
            subscriber = this.onSubscriberAdd(subscriber);
            this._subscribers[subscriber.id] = subscriber;
            this._subscribersCount++;
        }
        return subscriber;
    };
    Stream.prototype._subscriberRemove = function (subscriber) {
        if (subscriber.id in this._subscribers) {
            subscriber = this.onSubscriberRemove(subscriber).unsubscribe();
            delete this._subscribers[subscriber.id];
            this._subscribersCount--;
        }
        return this;
    };
    Stream.prototype._subscriberOnComplete = function (subscribers) {
        if (subscribers) {
            for (var _i = 0, subscribers_1 = subscribers; _i < subscribers_1.length; _i++) {
                var subscriber = subscribers_1[_i];
                subscriber.doComplete();
            }
        }
        else {
            for (var subscriberId in this._subscribers) {
                var subscriber = this._subscribers[subscriberId];
                if (!subscriber.isIsolated) {
                    this._subscribers[subscriberId].doComplete();
                }
            }
        }
        return this;
    };
    Stream.prototype._subscriberOnData = function (data, subscribers) {
        if (subscribers) {
            for (var _i = 0, subscribers_2 = subscribers; _i < subscribers_2.length; _i++) {
                var subscriber = subscribers_2[_i];
                subscriber.doData(data);
            }
        }
        else {
            for (var subscriberId in this._subscribers) {
                var subscriber = this._subscribers[subscriberId];
                if (!subscriber.isIsolated) {
                    this._subscribers[subscriberId].doData(data);
                }
            }
        }
        return this;
    };
    Stream.prototype._subscriberOnError = function (error, subscribers) {
        if (subscribers) {
            for (var _i = 0, subscribers_3 = subscribers; _i < subscribers_3.length; _i++) {
                var subscriber = subscribers_3[_i];
                subscriber.doError(error);
            }
        }
        else {
            for (var subscriberId in this._subscribers) {
                var subscriber = this._subscribers[subscriberId];
                if (!subscriber.isIsolated) {
                    this._subscribers[subscriberId].doError(error);
                }
            }
        }
        return this;
    };
    Stream.prototype.onSubscriberAdd = function (subscriber) {
        return subscriber;
    };
    Stream.prototype.onSubscriberRemove = function (subscriber) {
        return subscriber;
    };
    return Stream;
}());
exports.Stream = Stream;
