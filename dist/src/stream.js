"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("./buffer");
var const_1 = require("./const");
var storage_1 = require("./storage");
var subscriber_1 = require("./subscriber");
var errors_1 = require("./errors");
var resource_1 = require("./resource");
var SHARED_SUBSCRIBER_TAG = 0;
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
    Stream.prototype.getCompatible = function () {
        return new Stream();
    };
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
        var stream = this.getCompatible();
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
        return this._subscriberAdd(new subscriber_1.Subscriber(this, onData instanceof Stream ? onData.emit.bind(onData) : onData, onError instanceof Stream ? onError.error.bind(onError) : onError, onComplete instanceof Stream ? onComplete.complete.bind(onComplete) : onComplete));
    };
    Stream.prototype.subscribeOnComplete = function (onComplete) {
        return this._subscriberAdd(new subscriber_1.Subscriber(this, void 0, void 0, onComplete instanceof Stream ? onComplete.complete.bind(onComplete) : onComplete));
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
        var stream = this.getCompatible().setRoot(this.root)._middlewareAdd(middleware);
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
            this._subscribers = new storage_1.Storage(10, 1);
        }
        this._subscribers.add(this.onSubscriberAdd(subscriber), subscriber.isShared ? SHARED_SUBSCRIBER_TAG : void 0);
        return subscriber;
    };
    Stream.prototype._subscriberRemove = function (subscriber) {
        if (!this._subscribers) {
            return this;
        }
        this._subscribers.delete(this.onSubscriberRemove(subscriber), subscriber.isShared ? SHARED_SUBSCRIBER_TAG : void 0);
        return this._isAutocomplete && this.subscribersCount === 0 ? this._shutdown() : this;
    };
    Stream.prototype._subscriberOnComplete = function (subscribers) {
        if (subscribers) {
            for (var _i = 0, subscribers_1 = subscribers; _i < subscribers_1.length; _i++) {
                var subscriber = subscribers_1[_i];
                if (subscriber.stream === this) {
                    subscriber.doComplete(subscribers);
                }
            }
            // trigger shared also
            if (this._subscribers) {
                var sharedSubscribers = this._subscribers.getTagged(SHARED_SUBSCRIBER_TAG);
                if (sharedSubscribers) {
                    for (var _a = 0, _b = sharedSubscribers.storage; _a < _b.length; _a++) {
                        var subscriber = _b[_a];
                        if (subscriber) {
                            subscriber.doComplete(subscribers);
                        }
                    }
                }
            }
        }
        else if (this._subscribers) {
            for (var _c = 0, _d = this._subscribers.storage; _c < _d.length; _c++) {
                var subscriber = _d[_c];
                if (subscriber) {
                    subscriber.doComplete(subscribers);
                }
            }
        }
        return this;
    };
    Stream.prototype._subscriberOnData = function (data, subscribers) {
        if (subscribers) {
            for (var _i = 0, subscribers_2 = subscribers; _i < subscribers_2.length; _i++) {
                var subscriber = subscribers_2[_i];
                if (subscriber.stream === this) {
                    subscriber.doData(data, subscribers);
                }
            }
            // trigger shared also
            if (this._subscribers) {
                var sharedSubscribers = this._subscribers.getTagged(SHARED_SUBSCRIBER_TAG);
                if (sharedSubscribers) {
                    for (var _a = 0, _b = sharedSubscribers.storage; _a < _b.length; _a++) {
                        var subscriber = _b[_a];
                        if (subscriber) {
                            subscriber.doData(data, subscribers);
                        }
                    }
                }
            }
        }
        else if (this._subscribers) {
            for (var _c = 0, _d = this._subscribers.storage; _c < _d.length; _c++) {
                var subscriber = _d[_c];
                if (subscriber) {
                    subscriber.doData(data, subscribers);
                }
            }
        }
        return this;
    };
    Stream.prototype._subscriberOnError = function (error, subscribers) {
        if (subscribers) {
            for (var _i = 0, subscribers_3 = subscribers; _i < subscribers_3.length; _i++) {
                var subscriber = subscribers_3[_i];
                if (subscriber.stream === this) {
                    subscriber.doError(error, subscribers);
                }
            }
            // trigger shared also
            if (this._subscribers) {
                var sharedSubscribers = this._subscribers.getTagged(SHARED_SUBSCRIBER_TAG);
                if (sharedSubscribers) {
                    for (var _a = 0, _b = sharedSubscribers.storage; _a < _b.length; _a++) {
                        var subscriber = _b[_a];
                        if (subscriber) {
                            subscriber.doError(error, subscribers);
                        }
                    }
                }
            }
        }
        else if (this._subscribers) {
            for (var _c = 0, _d = this._subscribers.storage; _c < _d.length; _c++) {
                var subscriber = _d[_c];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUN0QyxpQ0FBNkM7QUFJN0MscUNBQWtDO0FBQ2xDLDJDQUEwRDtBQUkxRCxtQ0FBZ0Q7QUFDaEQsdUNBQXlDO0FBRXpDLElBQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0FBRWhDOztHQUVHO0FBQ0g7SUEyQ0k7UUExQlUsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO0lBNEJ4QyxDQUFDO0lBMUJELHNCQUFrQixtQkFBUzthQUEzQjtZQUNJLE1BQU0sQ0FBQyxpQkFBUyxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVZLGtCQUFXLEdBQXpCLFVBQTZCLE9BQW1CO1FBQzVDLElBQU0sTUFBTSxHQUF1QixJQUFJLE1BQU0sRUFBSyxDQUFDO1FBRW5ELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVuRixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFYSxZQUFLLEdBQW5CO1FBQXVCLGdCQUE0QzthQUE1QyxVQUE0QyxFQUE1QyxxQkFBNEMsRUFBNUMsSUFBNEM7WUFBNUMsMkJBQTRDOztRQUMvRCxJQUFNLE1BQU0sR0FBdUIsSUFBSSxNQUFNLEVBQUssQ0FBQztRQUVuRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUNqQixJQUFNLFdBQVcsR0FBdUIsS0FBSyxZQUFZLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRXJHLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBTSxD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