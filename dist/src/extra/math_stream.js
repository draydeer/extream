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
var stream_1 = require("../stream");
var MathStream = /** @class */ (function (_super) {
    __extends(MathStream, _super);
    function MathStream(_accumulator) {
        if (_accumulator === void 0) { _accumulator = 0; }
        var _this = _super.call(this) || this;
        _this._accumulator = _accumulator;
        return _this;
    }
    Object.defineProperty(MathStream.prototype, "clone", {
        get: function () {
            return new MathStream();
        },
        enumerable: true,
        configurable: true
    });
    MathStream.prototype.abs = function () {
        return this._middlewareAdd(function (data) { return Math.abs(data); });
    };
    MathStream.prototype.average = function () {
        var _this = this;
        return this._middlewareAdd(function (data) { return data / (_this._transmittedCount + 1); });
    };
    MathStream.prototype.max = function () {
        var _this = this;
        return this._middlewareAdd(function (data) {
            _this._max = _this._max === void 0 ? data : (_this._max > data ? _this._max : data);
            return _this._max;
        });
    };
    MathStream.prototype.min = function () {
        var _this = this;
        return this._middlewareAdd(function (data) {
            _this._min = _this._min === void 0 ? data : (_this._min < data ? _this._min : data);
            return _this._min;
        });
    };
    MathStream.prototype.reduce = function (reducer) {
        var _this = this;
        return this._middlewareAdd(function (data) {
            _this._accumulator = reducer(_this._accumulator, data, _this._transmittedCount + 1);
            return _this._accumulator;
        });
    };
    MathStream.prototype.mul = function () {
        var _this = this;
        return this._middlewareAdd(function (data) { return _this._accumulator = (_this._accumulator || 1) * data; });
    };
    MathStream.prototype.sqrt = function () {
        return this._middlewareAdd(function (data) { return Math.sqrt(data); });
    };
    MathStream.prototype.sum = function () {
        var _this = this;
        return this._middlewareAdd(function (data) { return _this._accumulator += data; });
    };
    return MathStream;
}(stream_1.Stream));
exports.MathStream = MathStream;
