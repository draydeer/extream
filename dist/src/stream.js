"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("./buffer");
var const_1 = require("./const");
var storage_1 = require("./storage");
var subscriber_1 = require("./subscriber");
/**
 * Stream.
 */
var Stream = /** @class */ (function () {
    function Stream() {
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
    Object.defineProperty(Stream.prototype, "compatible", {
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
            return this._subscribers ? this._subscribers.storage.length : 0;
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
        this._subscriberOnComplete();
        return this;
    };
    Stream.prototype.emit = function (data, subscribers) {
        if (this._prebuffer) {
            if (this._isProcessing) {
                this._prebuffer.add([data, subscribers]);
            }
            else {
                this._emitLoop(subscribers, 0, void 0, data);
            }
        }
        else {
            this._emitLoop(subscribers, 0, void 0, data);
        }
        return this;
    };
    Stream.prototype.emitAndComplete = function (data, subscribers) {
        if (this._prebuffer) {
            if (this._isProcessing) {
                this._prebuffer.add([data, subscribers]);
            }
            else {
                this._emitLoop(subscribers, 0, this._subscriberOnComplete.bind(this, subscribers), data);
            }
        }
        else {
            this._emitLoop(subscribers, 0, this._subscriberOnComplete.bind(this, subscribers), data);
        }
        return this;
    };
    Stream.prototype.error = function (error) {
        this._subscriberOnError(error);
        return this;
    };
    Stream.prototype.fork = function () {
        var stream = this.compatible;
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
        this._postbuffer = new buffer_1.CyclicBuffer(size);
        return this;
    };
    Stream.prototype.prebuffer = function (size) {
        if (size === void 0) { size = 10; }
        this._prebuffer = new buffer_1.CyclicBuffer(size);
        return this;
    };
    Stream.prototype.progressive = function () {
        this._isProgressive = true;
        return this;
    };
    Stream.prototype.resume = function () {
        this._isPaused = false;
        return this;
    };
    Stream.prototype.synchronized = function () {
        this._isSynchronized = true;
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
    /** Continues processing after expiration of  */
    Stream.prototype.debounce = function (seconds) {
        var nextMoment;
        return this._middlewareAdd(function (data) {
            var moment = Date.now();
            if (nextMoment === void 0 || nextMoment <= moment) {
                nextMoment = moment + seconds * 1000;
                return data;
            }
            return const_1.CANCELLED;
        });
    };
    /** Runs debug callback then returns incoming data as is */
    Stream.prototype.debug = function (callback) {
        return this._middlewareAdd(function (data) {
            callback(data);
            return data;
        });
    };
    /** Dispatches data to subscribers ahead of processing by remained middlewares */
    Stream.prototype.dispatch = function () {
        var _this = this;
        return this._middlewareAdd(function (data) {
            _this._subscriberOnData(data);
            return data;
        });
    };
    /** Executes custom handler over data then returns result value or income data as is if returned value is undefined */
    Stream.prototype.exec = function (middleware) {
        return this._middlewareAdd(function (data, stream) {
            var result = middleware(data, stream);
            return result !== void 0 ? result : data;
        });
    };
    /** Filters data comparing with initial value or by applying custom handler that returns boolean */
    Stream.prototype.filter = function (middleware) {
        return this._middlewareAdd(middleware instanceof Function
            ? function (data, stream) { return middleware(data, stream) ? data : const_1.CANCELLED; }
            : function (data, stream) { return middleware === data ? data : const_1.CANCELLED; });
    };
    /** Completes after first value received */
    Stream.prototype.first = function () {
        var _this = this;
        this._middlewareAfterDispatchAdd(function (data) {
            _this.complete();
            return data;
        });
        return this;
    };
    /** Maps data by replacing by initial value or by applying custom handler */
    Stream.prototype.map = function (middleware) {
        return this._middlewareAdd(middleware);
    };
    /** Redirects data to selected stream */
    Stream.prototype.redirect = function (selector, streams) {
        return this._middlewareAdd(function (data) {
            var index = selector(data);
            if (index in streams) {
                streams[index].emit(data);
                return data;
            }
            throw new Error("\"redirect\" middleware got invalid index from selector: " + index);
        });
    };
    Stream.prototype.reduce = function (reducer, accumulator) {
        var _this = this;
        return this._middlewareAdd(function (data) {
            accumulator = reducer(accumulator, data, _this._transmittedCount);
            return accumulator;
        });
    };
    Stream.prototype.select = function (selector, streams) {
        var _this = this;
        return this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            var index = selector(data);
            if (index in streams) {
                var subscriber = streams[index].subscribe(_this._emitLoop.bind(_this, subscribers, middlewareIndex, cb), _this._subscriberOnError.bind(_this)).isolated().once();
                streams[index].root.emit(data, [subscriber]);
                return const_1.CANCELLED;
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
    Stream.prototype._emitLoop = function (subscribers, middlewareIndex, cb, data) {
        if (data instanceof Promise) {
            data.then(this._emitLoop.bind(this, subscribers, middlewareIndex, cb), this._subscriberOnError.bind(this));
            return;
        }
        this._isProcessing = true;
        while (true) {
            if (this._middlewares) {
                for (var l = this._middlewares.length; middlewareIndex < l; middlewareIndex++) {
                    data = this._middlewares[middlewareIndex](data, this, subscribers, middlewareIndex + 1, cb);
                    if (data instanceof Promise) {
                        data.then(this._emitLoop.bind(this, subscribers, middlewareIndex + 1, cb), this._subscriberOnError.bind(this));
                        if (this._isSynchronized) {
                            return;
                        }
                        data = const_1.CANCELLED;
                        break;
                    }
                    if (data === const_1.CANCELLED) {
                        break;
                    }
                }
                if (data !== const_1.CANCELLED) {
                    this._transmittedCount++;
                    this._subscriberOnData(data, subscribers);
                }
            }
            else {
                this._transmittedCount++;
                this._subscriberOnData(data, subscribers);
            }
            if (!this._prebuffer || this._prebuffer.isEmpty) {
                this._isProcessing = false;
                return cb ? cb(data) : data;
            }
            middlewareIndex = 0;
            _a = this._prebuffer.shift(), data = _a[0], subscribers = _a[1];
        }
        var _a;
    };
    Stream.prototype._middlewareAdd = function (middleware) {
        if (this._middlewares === void 0) {
            this._middlewares = [];
        }
        this._middlewares.push(middleware);
        if (this._isProgressive) {
            return this;
        }
        var stream = this.compatible.setRoot(this.root);
        this._subscriberAdd(new subscriber_1.UnsafeSubscriber(this, stream.emit.bind(stream), stream.error.bind(stream), stream.complete.bind(stream)));
        return this._isProgressive ? this : stream;
    };
    Stream.prototype._middlewareAfterDispatchAdd = function (middleware) {
        if (this._middlewaresAfterDispatch === void 0) {
            this._middlewaresAfterDispatch = [];
        }
        this._middlewaresAfterDispatch.push(middleware);
        return middleware;
    };
    Stream.prototype._subscriberAdd = function (subscriber) {
        if (!this._subscribers) {
            this._subscribers = new storage_1.Storage();
        }
        this._subscribers.add(this.onSubscriberAdd(subscriber));
        return subscriber;
    };
    Stream.prototype._subscriberRemove = function (subscriber) {
        if (!this._subscribers) {
            return this;
        }
        this._subscribers.delete(this.onSubscriberRemove(subscriber));
        return this;
    };
    Stream.prototype._subscriberOnComplete = function (subscribers) {
        if (subscribers) {
            for (var _i = 0, subscribers_1 = subscribers; _i < subscribers_1.length; _i++) {
                var subscriber = subscribers_1[_i];
                subscriber.doComplete();
            }
        }
        else if (this._subscribers) {
            for (var _a = 0, _b = this._subscribers.storage; _a < _b.length; _a++) {
                var subscriber = _b[_a];
                subscriber.doComplete();
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
        else if (this._subscribers) {
            for (var _a = 0, _b = this._subscribers.storage; _a < _b.length; _a++) {
                var subscriber = _b[_a];
                subscriber.doData(data);
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
        else if (this._subscribers) {
            for (var _a = 0, _b = this._subscribers.storage; _a < _b.length; _a++) {
                var subscriber = _b[_a];
                subscriber.doError(error);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUN0QyxpQ0FBNkM7QUFJN0MscUNBQWtDO0FBQ2xDLDJDQUEwRDtBQUkxRDs7R0FFRztBQUNIO0lBNENJO1FBOUJVLHNCQUFpQixHQUFXLENBQUMsQ0FBQztJQWdDeEMsQ0FBQztJQTlCRCxzQkFBa0IsbUJBQVM7YUFBM0I7WUFDSSxNQUFNLENBQUMsaUJBQVMsQ0FBQztRQUNyQixDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFFWSxrQkFBVyxHQUF6QixVQUE2QixPQUFtQjtRQUM1QyxJQUFNLE1BQU0sR0FBdUIsSUFBSSxNQUFNLEVBQUssQ0FBQztRQUVuRCxPQUFPLENBQUMsSUFBSSxDQUNSLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUN0QyxDQUFDLEtBQUssQ0FDSCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FDNUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLFlBQUssR0FBbkI7UUFBdUIsZ0JBQTRDO2FBQTVDLFVBQTRDLEVBQTVDLHFCQUE0QyxFQUE1QyxJQUE0QztZQUE1QywyQkFBNEM7O1FBQy9ELElBQU0sTUFBTSxHQUF1QixJQUFJLE1BQU0sRUFBSyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO1lBQ2pCLElBQU0sV0FBVyxHQUF1QixLQUFLLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFFckcsV0FBVyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFD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