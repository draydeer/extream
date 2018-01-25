"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var delegate_1 = require("./delegate");
var const_1 = require("./const");
var stream_1 = require("./stream");
var Executor = /** @class */ (function (_super) {
    __extends(Executor, _super);
    function Executor(async) {
        var _this = _super.call(this) || this;
        _this._incomingStream = new stream_1.Stream();
        _this._async = async;
        _this._delegate = new delegate_1.Delegate(_this);
        return _this;
    }
    Object.defineProperty(Executor.prototype, "incoming", {
        get: function () {
            return this._incomingStream;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "isRunning", {
        get: function () {
            return !!this._promise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "promise", {
        get: function () {
            if (this._promise) {
                return this._promise;
            }
            this.run();
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    Executor.prototype.complete = function () {
        this._incomingStream.error(const_1.COMPLETED);
        return _super.prototype.complete.call(this);
    };
    Executor.prototype.emit = function (data) {
        this._incomingStream.emit(data);
        return this;
    };
    Executor.prototype.error = function (error) {
        this._incomingStream.error(error);
        return this;
    };
    Executor.prototype.pipeOutgoingTo = function () {
        var _this = this;
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        streams.forEach(function (stream) { return _this.subscribeStream(stream); });
        return this;
    };
    Executor.prototype.pipeToIncoming = function () {
        var _this = this;
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        streams.forEach(function (stream) { return stream.subscribeStream(_this._incomingStream); });
        return this;
    };
    Executor.prototype.run = function () {
        var _this = this;
        if (this._promise) {
            return this;
        }
        this._promise = this._async(this._delegate).then(function (result) {
            _this._promise = void 0;
            _this._result = result;
            _super.prototype.emit.call(_this, result);
            return result;
        }).catch(function (error) {
            _this._promise = void 0;
            _this._error = error;
            _super.prototype.error.call(_this, error);
            throw error;
        });
        return this;
    };
    // promise like
    Executor.prototype.catch = function (onrejected) {
        return this.promise.catch(onrejected);
    };
    Executor.prototype.then = function (onfulfilled) {
        return this.promise.then(onfulfilled);
    };
    return Executor;
}(stream_1.Stream));
exports.Executor = Executor;
