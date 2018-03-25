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
    Object.defineProperty(Stream.prototype, "compatible", {
        get: function () {
            return new Stream();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "isCompleted", {
        get: function () {
            return this._isCompleted === true;
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
    Object.defineProperty(Stream.prototype, "isShared", {
        get: function () {
            return this._isShared;
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
    Object.defineProperty(Stream.prototype, "subscribers", {
        get: function () {
            return this._subscribers ? this._subscribers.storage : void 0;
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
    /**
     * Enables automatic completion of stream if count of subscribers becomes zero.
     */
    Stream.prototype.autocomplete = function () {
        this._isAutocomplete = true;
        return this;
    };
    Stream.prototype.complete = function (subscribers) {
        this._assertReady()._shutdown();
        return this;
    };
    Stream.prototype.emit = function (data, subscribers) {
        this._assertReady();
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
        this._assertReady();
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
        this._assertReady()._subscriberOnError(error, subscribers);
        return this;
    };
    Stream.prototype.shared = function () {
        this._isShared = true;
        return this;
    };
    Stream.prototype.fork = function () {
        var stream = this.compatible;
        this.subscribeStream(stream);
        return stream.setRoot(this.root);
    };
    /**
     * Pauses stream stopping processing of emitted values.
     */
    Stream.prototype.pause = function () {
        this._isPaused = true;
        return this;
    };
    /**
     * Initiates post buffer where emitted and processed values will be stored before to be sent to subscribers.
     */
    Stream.prototype.postbuffer = function (size) {
        if (size === void 0) { size = 10; }
        this._postbuffer = new buffer_1.CyclicBuffer(size);
        return this;
    };
    /**
     * Initiates pre buffer where emitted values will be stored before to be processed.
     */
    Stream.prototype.prebuffer = function (size) {
        if (size === void 0) { size = 10; }
        this._prebuffer = new buffer_1.CyclicBuffer(size);
        return this;
    };
    /**
     * Enables progressive mode when added middleware will be chained inside current stream instead initiate new one.
     */
    Stream.prototype.progressive = function () {
        this._isProgressive = true;
        return this;
    };
    /**
     * Resumes stream starting processing of emitted values.
     */
    Stream.prototype.resume = function () {
        this._isPaused = false;
        return this;
    };
    /**
     *
     */
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
        var subscription = this.subscribe(function (data, s, subscribers) { return stream.emit(data, subscribers); }, function (error, s, subscribers) { return stream.error(error, subscribers); }, function (s, subscribers) { return stream.complete(subscribers); });
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
                var subscriber = streams[index].subscribe(_this._emitLoop.bind(_this, subscribers, middlewareIndex, cb), _this._subscriberOnError.bind(_this)).once();
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
            _this.subscribe(resolve, function (e) { return reject(e); }, function () { return reject(const_1.COMPLETED); }).once();
        });
    };
    Stream.prototype._assertReady = function () {
        if (this._isCompleted) {
            throw new errors_1.StreamIsCompletedError();
        }
        return this;
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
        return this._isAutocomplete && this.subscribersCount === 0 ? this._shutdown() : this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUN0QyxpQ0FBNkM7QUFJN0MscUNBQWtDO0FBQ2xDLDJDQUEwRDtBQUkxRCxtQ0FBZ0Q7QUFDaEQsdUNBQXlDO0FBRXpDOztHQUVHO0FBQ0g7SUErQ0k7UUE5QlUsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO0lBZ0N4QyxDQUFDO0lBOUJELHNCQUFrQixtQkFBUzthQUEzQjtZQUNJLE1BQU0sQ0FBQyxpQkFBUyxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVZLGtCQUFXLEdBQXpCLFVBQTZCLE9BQW1CO1FBQzVDLElBQU0sTUFBTSxHQUF1QixJQUFJLE1BQU0sRUFBSyxDQUFDO1FBRW5ELE9BQU8sQ0FBQyxJQUFJLENBQ1IsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQ3RDLENBQUMsS0FBSyxDQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUM1QixDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRWEsWUFBSyxHQUFuQjtRQUF1QixnQkFBNEM7YUFBNUMsVUFBNEMsRUFBNUMscUJBQTRDLEVBQTVDLElBQTRDO1lBQTVDLDJCQUE0Qzs7UUFDL0QsSUFBTSxNQUFNLEdBQXVCLElBQUksTUFBTSxFQUFLLENBQUM7UUFFbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDakIsSUFBTSxXQUFXLEdBQXVCLEtBQUssWUFBWSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUVyRyxXQUFXLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FB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