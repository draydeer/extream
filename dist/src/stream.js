"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var stream_buffer_1 = require("./stream_buffer");
var subscriber_1 = require("./subscriber");
var singleElementPrebuffer = [];
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
    Stream.prototype.complete = function () {
        this._complete();
        return this;
    };
    Stream.prototype.complex = function () {
        this._isComplex = true;
        return this;
    };
    Stream.prototype.emit = function (data) {
        this._emit(data);
        return this;
    };
    Stream.prototype.emitAndComplete = function (data) {
        this._emit(data).then(this.complete.bind(this));
        return this;
    };
    Stream.prototype.error = function (error) {
        this._subscriberOnError(error);
        return this;
    };
    Stream.prototype.fork = function () {
        var stream = new Stream();
        this.subscribeStream(stream);
        return stream;
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
    Stream.prototype.delay = function (milliseconds) {
        return this._middlewareAdd(function (data) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(data); }, milliseconds); }); });
    };
    Stream.prototype.dispatch = function () {
        var _this = this;
        return this._middlewareAdd(function (data, stream) {
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
        this._middlewareAfterDispatchAdd(function (data, stream) {
            _this._subscriberOnData(data).complete();
            return data;
        });
        return this;
    };
    Stream.prototype.map = function (middleware) {
        return this._middlewareAdd(middleware);
    };
    Stream.prototype.skip = function (count) {
        return this._middlewareAdd(function (data, stream) { return count-- > 0 ? const_1.CANCELLED : data; });
    };
    Stream.prototype.toOnCompletePromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.subscribe(void 0, reject, function () { return resolve(_this._lastValue); });
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
    Stream.prototype._emit = function (data) {
        if (this._prebuffer) {
            this._prebuffer.add(data);
            if (!this._emitPromise) {
                this._emitPromise = this._emitLoop(this._prebuffer);
            }
        }
        else {
            singleElementPrebuffer[0] = data;
            if (!this._emitPromise) {
                this._emitPromise = this._emitLoop(singleElementPrebuffer);
            }
        }
        return this._emitPromise;
    };
    Stream.prototype._emitLoop = function (prebuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var temp, _i, prebuffer_1, data, cancelled, _a, _b, middleware, _c, _d, middleware;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _i = 0, prebuffer_1 = prebuffer;
                        _e.label = 1;
                    case 1:
                        if (!(_i < prebuffer_1.length)) return [3 /*break*/, 10];
                        data = prebuffer_1[_i];
                        temp = data;
                        if (this._isPaused) {
                            return [3 /*break*/, 10];
                        }
                        cancelled = false;
                        if (!this._middlewares) return [3 /*break*/, 5];
                        _a = 0, _b = this._middlewares;
                        _e.label = 2;
                    case 2:
                        if (!(_a < _b.length)) return [3 /*break*/, 5];
                        middleware = _b[_a];
                        return [4 /*yield*/, middleware(temp, this)];
                    case 3:
                        temp = _e.sent();
                        if (temp === const_1.CANCELLED) {
                            cancelled = true;
                            return [3 /*break*/, 5];
                        }
                        _e.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (cancelled) {
                            return [3 /*break*/, 9];
                        }
                        this._lastValue = temp;
                        this._transmittedCount++;
                        this._subscriberOnData(temp);
                        if (!this._middlewaresAfterDispatch) return [3 /*break*/, 9];
                        _c = 0, _d = this._middlewaresAfterDispatch;
                        _e.label = 6;
                    case 6:
                        if (!(_c < _d.length)) return [3 /*break*/, 9];
                        middleware = _d[_c];
                        return [4 /*yield*/, middleware(temp, this)];
                    case 7:
                        temp = _e.sent();
                        if (temp === const_1.CANCELLED) {
                            cancelled = true;
                            return [3 /*break*/, 9];
                        }
                        _e.label = 8;
                    case 8:
                        _c++;
                        return [3 /*break*/, 6];
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10:
                        this._emitPromise = null;
                        return [2 /*return*/, temp];
                }
            });
        });
    };
    Stream.prototype._middlewareAdd = function (middleware) {
        if (this._middlewares === void 0) {
            this._middlewares = [];
        }
        this._middlewares.push(middleware);
        if (this._isComplex) {
            var stream = new this.constructor();
            this.subscribeStream(stream);
            return stream;
        }
        return this;
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
    Stream.prototype._subscriberOnComplete = function () {
        for (var _i = 0, _a = Object.keys(this._subscribers); _i < _a.length; _i++) {
            var subscriberId = _a[_i];
            this._subscribers[subscriberId].doComplete();
        }
        return this;
    };
    Stream.prototype._subscriberOnData = function (data) {
        for (var _i = 0, _a = Object.keys(this._subscribers); _i < _a.length; _i++) {
            var subscriberId = _a[_i];
            this._subscribers[subscriberId].doData(data);
        }
        return this;
    };
    Stream.prototype._subscriberOnError = function (error) {
        for (var _i = 0, _a = Object.keys(this._subscribers); _i < _a.length; _i++) {
            var subscriberId = _a[_i];
            this._subscribers[subscriberId].doError(error);
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
