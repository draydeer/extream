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
            return const_1.Completed;
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
    Stream.prototype.autoComplete = function () {
        this._isAutocomplete = true;
        return this;
    };
    /**
     *
     */
    Stream.prototype.cold = function () {
        this._isCold = true;
        return this;
    };
    Stream.prototype.complete = function (subscribers) {
        this._assertReady()._shutdown();
        return this;
    };
    Stream.prototype.emit = function (data, subscribers) {
        this._assertReady();
        if (this._inpBuffer) {
            if (this._isProcessing) {
                this._inpBuffer.add([data, subscribers]);
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
        if (this._inpBuffer) {
            if (this._isProcessing) {
                this._inpBuffer.add([data, subscribers]);
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
     * Initiates input buffer where emitted values will be stored before to be processed.
     */
    Stream.prototype.inpBuffer = function (size) {
        if (size === void 0) { size = 10; }
        this._inpBuffer = new buffer_1.CyclicBuffer(size);
        return this;
    };
    /**
     * Initiates output buffer where emitted and processed values will be stored before to be sent to subscribers.
     */
    Stream.prototype.outBuffer = function (size) {
        if (size === void 0) { size = 10; }
        this._outBuffer = new buffer_1.CyclicBuffer(size);
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
    /** Checks is data is async and plans its postponed emission */
    Stream.prototype.await = function () {
        var _this = this;
        return this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            if (data instanceof Promise) {
                data.then(_this._emitLoop.bind(_this, subscribers, middlewareIndex, cb), function (error) { return _this._subscriberOnError(error, subscribers); });
                return const_1.Cancelled;
            }
            else if (data instanceof Stream) {
                data.subscribe(_this._emitLoop.bind(_this, subscribers, middlewareIndex, cb), function (error) { return _this._subscriberOnError(error, subscribers); });
                return const_1.Cancelled;
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
            return const_1.Cancelled;
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
            ? function (data, stream) { return middleware(data, stream) ? data : const_1.Cancelled; }
            : function (data, stream) { return middleware === data ? data : const_1.Cancelled; });
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
                return const_1.Cancelled;
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
                return const_1.Cancelled;
            }
            throw new Error("\"select\" middleware got invalid index from selector: " + index);
        });
    };
    /** Opposite to "filter" */
    Stream.prototype.skip = function (middleware) {
        return this._middlewareAdd(middleware instanceof Function
            ? function (data, stream) { return middleware(data, stream) ? const_1.Cancelled : data; }
            : function (data, stream) { return middleware === data ? const_1.Cancelled : data; });
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
            return const_1.Cancelled;
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
            _this.subscribe(void 0, resolve, function () { return reject(const_1.Completed); }).once();
        });
    };
    Stream.prototype.toPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.subscribe(resolve, function (e) { return reject(e); }, function () { return reject(const_1.Completed); }).once();
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
                for (var l = this._middlewares.length; middlewareIndex < l; middlewareIndex += 1) {
                    data = this._middlewares[middlewareIndex](data, this, subscribers, middlewareIndex + 1, cb);
                    if (data === const_1.Cancelled) {
                        break;
                    }
                }
            }
            if (data !== const_1.Cancelled) {
                this._lastValue = data;
                this._transmittedCount += 1;
                this._subscriberOnData(data, subscribers);
            }
            if (!this._inpBuffer || this._inpBuffer.isEmpty) {
                this._isProcessing = false;
                return cb ? cb(data) : data;
            }
            middlewareIndex = 0;
            _a = this._inpBuffer.shift(), data = _a[0], subscribers = _a[1];
        }
        var _a;
    };
    Stream.prototype._middlewareAdd = function (middleware, progressive, tag) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUN0QyxpQ0FBNkM7QUFJN0MscUNBQWtDO0FBQ2xDLDJDQUEwRDtBQUkxRCxtQ0FBZ0Q7QUFDaEQsdUNBQXlDO0FBRXpDLElBQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0FBRWhDOztHQUVHO0FBQ0g7SUE0Q0k7UUExQlUsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO0lBNEJ4QyxDQUFDO0lBMUJELHNCQUFrQixtQkFBUzthQUEzQjtZQUNJLE1BQU0sQ0FBQyxpQkFBUyxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVZLGtCQUFXLEdBQXpCLFVBQTZCLE9BQW1CO1FBQzVDLElBQU0sTUFBTSxHQUF1QixJQUFJLE1BQU0sRUFBSyxDQUFDO1FBRW5ELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVuRixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFYSxZQUFLLEdBQW5CO1FBQXVCLGdCQUE0QzthQUE1QyxVQUE0QyxFQUE1QyxxQkFBNEMsRUFBNUMsSUFBNEM7WUFBNUMsMkJBQTRDOztRQUMvRCxJQUFNLE1BQU0sR0FBdUIsSUFBSSxNQUFNLEVBQUssQ0FBQztRQUVuRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUNqQixJQUFNLFdBQVcsR0FBdUIsS0FBSyxZQUFZLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRXJHLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBTSxD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