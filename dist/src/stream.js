"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("./buffer");
var const_1 = require("./const");
var storage_1 = require("./storage");
var subscriber_1 = require("./subscriber");
var errors_1 = require("./errors");
var resource_1 = require("./resource");
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
    Object.defineProperty(Stream.prototype, "completed", {
        get: function () {
            return this._isCompleted === true;
        },
        enumerable: true,
        configurable: true
    });
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
    Stream.prototype.complete = function (subscribers) {
        if (this._isCompleted) {
            throw new errors_1.StreamIsCompletedError();
        }
        this._shutdown();
        return this;
    };
    Stream.prototype.emit = function (data, subscribers) {
        if (this._isCompleted) {
            throw new errors_1.StreamIsCompletedError();
        }
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
        if (this._isCompleted) {
            throw new errors_1.StreamIsCompletedError();
        }
        if (this._prebuffer) {
            if (this._isProcessing) {
                this._prebuffer.add([data, subscribers]);
            }
            else {
                this._emitLoop(subscribers, 0, this.complete.bind(this, subscribers), data);
            }
        }
        else {
            this._emitLoop(subscribers, 0, this.complete.bind(this, subscribers), data);
        }
        return this;
    };
    Stream.prototype.error = function (error, subscribers) {
        if (this._isCompleted) {
            throw new errors_1.StreamIsCompletedError();
        }
        this._subscriberOnError(error, subscribers);
        return this;
    };
    Stream.prototype.fork = function () {
        var stream = this.compatible;
        this.subscribeStream(stream);
        return stream.setRoot(this.root);
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
    Stream.prototype.await = function () {
        var _this = this;
        return this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            if (data instanceof Promise) {
                data.then(_this._emitLoop.bind(_this, subscribers, middlewareIndex, cb), function (error) { return _this._subscriberOnError(error, subscribers); });
                return const_1.CANCELLED;
            }
            else if (data instanceof Stream) {
                data.subscribe(_this._emitLoop.bind(_this, subscribers, middlewareIndex, cb), function (error) { return _this._subscriberOnError(error, subscribers); });
                return const_1.CANCELLED;
            }
            return data;
        }, true);
    };
    /** Continues processing after expiration of  */
    Stream.prototype.debounce = function (seconds) {
        var _this = this;
        var cachedData;
        var timerResource = this._resourceAdd(new resource_1.TimerResource());
        return this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            cachedData = data;
            timerResource
                .clear()
                .open(function () { return _this._emitLoop(subscribers, middlewareIndex, cb, cachedData); }, seconds);
            return const_1.CANCELLED;
        });
    };
    /** Runs debug callback then returns incoming data as is */
    Stream.prototype.debug = function (callback) {
        return this._middlewareAdd(function (data) {
            callback(data);
            return data;
        }, true);
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
        return this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            var index = selector(data);
            if (index in streams) {
                streams[index].root.emit(data, subscribers);
                return const_1.CANCELLED;
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
    /** Continues processing after expiration of  */
    Stream.prototype.throttle = function (seconds) {
        var _this = this;
        var cachedData;
        var timerResource = this._resourceAdd(new resource_1.TimerResource());
        return this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            cachedData = data;
            if (!timerResource.resource) {
                timerResource.open(function () { return _this._emitLoop(subscribers, middlewareIndex, cb, cachedData); }, seconds);
            }
            return const_1.CANCELLED;
        });
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
        this._isProcessing = true;
        while (true) {
            if (this._middlewares) {
                for (var l = this._middlewares.length; middlewareIndex < l; middlewareIndex++) {
                    data = this._middlewares[middlewareIndex](data, this, subscribers, middlewareIndex + 1, cb);
                    if (data === const_1.CANCELLED) {
                        break;
                    }
                }
            }
            if (data !== const_1.CANCELLED) {
                this._lastValue = data;
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
    Stream.prototype._middlewareAdd = function (middleware, progressive) {
        if (this._middlewares === void 0) {
            this._middlewares = [middleware];
            return this;
        }
        if (progressive || this._isProgressive) {
            this._middlewares.push(middleware);
            return this;
        }
        var stream = this.compatible.setRoot(this.root)._middlewareAdd(middleware);
        this._subscriberAdd(new subscriber_1.UnsafeSubscriber(this, stream.emit.bind(stream), stream.error.bind(stream), stream.complete.bind(stream)));
        return stream;
    };
    Stream.prototype._middlewareAfterDispatchAdd = function (middleware) {
        if (this._middlewaresAfterDispatch === void 0) {
            this._middlewaresAfterDispatch = [];
        }
        this._middlewaresAfterDispatch.push(middleware);
        return middleware;
    };
    Stream.prototype._resourceAdd = function (resource) {
        if (this._resources === void 0) {
            this._resources = [];
        }
        this._resources.push(resource);
        return resource;
    };
    Stream.prototype._shutdown = function () {
        this._subscriberOnComplete();
        if (this._resources) {
            for (var _i = 0, _a = this._resources; _i < _a.length; _i++) {
                var resource = _a[_i];
                resource.close();
            }
        }
        this._lastValue = this._root = void 0;
        return this;
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
        if (this._subscribers) {
            for (var _i = 0, _a = this._subscribers.storage; _i < _a.length; _i++) {
                var subscriber = _a[_i];
                if (subscriber) {
                    subscriber.doComplete(subscribers);
                }
            }
        }
        return this;
    };
    Stream.prototype._subscriberOnData = function (data, subscribers) {
        if (this._subscribers) {
            for (var _i = 0, _a = this._subscribers.storage; _i < _a.length; _i++) {
                var subscriber = _a[_i];
                if (subscriber) {
                    subscriber.doData(data, subscribers);
                }
            }
        }
        return this;
    };
    Stream.prototype._subscriberOnError = function (error, subscribers) {
        if (this._subscribers) {
            for (var _i = 0, _a = this._subscribers.storage; _i < _a.length; _i++) {
                var subscriber = _a[_i];
                if (subscriber) {
                    subscriber.doError(error, subscribers);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUN0QyxpQ0FBNkM7QUFJN0MscUNBQWtDO0FBQ2xDLDJDQUEwRDtBQUkxRCxtQ0FBZ0Q7QUFDaEQsdUNBQXlDO0FBRXpDOztHQUVHO0FBQ0g7SUE2Q0k7UUE5QlUsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO0lBZ0N4QyxDQUFDO0lBOUJELHNCQUFrQixtQkFBUzthQUEzQjtZQUNJLE1BQU0sQ0FBQyxpQkFBUyxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVZLGtCQUFXLEdBQXpCLFVBQTZCLE9BQW1CO1FBQzVDLElBQU0sTUFBTSxHQUF1QixJQUFJLE1BQU0sRUFBSyxDQUFDO1FBRW5ELE9BQU8sQ0FBQyxJQUFJLENBQ1IsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQ3RDLENBQUMsS0FBSyxDQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUM1QixDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRWEsWUFBSyxHQUFuQjtRQUF1QixnQkFBNEM7YUFBNUMsVUFBNEMsRUFBNUMscUJBQTRDLEVBQTVDLElBQTRDO1lBQTVDLDJCQUE0Qzs7UUFDL0QsSUFBTSxNQUFNLEdBQXVCLElBQUksTUFBTSxFQUFLLENBQUM7UUFFbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDakIsSUFBTSxXQUFXLEdBQXVCLEtBQUssWUFBWSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUVyRyxXQUFXLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FB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