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
var const_1 = require("./const");
var stream_1 = require("./stream");
var Executor = (function (_super) {
    __extends(Executor, _super);
    function Executor(async) {
        var _this = _super.call(this) || this;
        _this._incomingStream = new stream_1.Stream();
        _this._agent = new Agent(_this, _super.prototype.emit.bind(_this), _this._incomingStream);
        _this._async = async;
        return _this;
    }
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
    Executor.prototype.cancel = function () {
        this._incomingStream.error(const_1.CANCELLED);
        return this;
    };
    Executor.prototype.complete = function () {
        this._incomingStream.complete();
        return this;
    };
    Executor.prototype.emit = function (data) {
        this._incomingStream.emit(data);
        return this;
    };
    Executor.prototype.error = function (error) {
        this._incomingStream.emit(error);
        return this;
    };
    Executor.prototype.run = function () {
        var _this = this;
        if (this._promise) {
            return this;
        }
        this._promise = this._async(this._agent).then(function (result) {
            _this._promise = void 0;
            _this._result = result;
            _super.prototype.emit.call(_this, result);
        }).catch(function (error) {
            _this._promise = void 0;
            _this._error = error;
            _super.prototype.error.call(_this, error);
        });
        return this;
    };
    return Executor;
}(stream_1.Stream));
exports.Executor = Executor;
var Agent = (function () {
    function Agent(executor, emit, incomingStream) {
        this._emit = emit;
        this._executor = executor;
        this._incomingStream = incomingStream;
    }
    Object.defineProperty(Agent.prototype, "incoming", {
        get: function () {
            return this._incomingStream;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "incomingStream", {
        get: function () {
            return this._incomingStream;
        },
        enumerable: true,
        configurable: true
    });
    Agent.prototype.emit = function (data) {
        this._emit(data);
        return this;
    };
    return Agent;
}());
exports.Agent = Agent;
