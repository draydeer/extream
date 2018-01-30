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
    Object.defineProperty(MathStream.prototype, "compatible", {
        get: function () {
            return new MathStream();
        },
        enumerable: true,
        configurable: true
    });
    MathStream.prototype.abs = function () {
        return this._middlewareAdd(Math.abs);
    };
    MathStream.prototype.average = function () {
        var _this = this;
        return this._middlewareAdd(function (data) { return data / (_this._transmittedCount + 1); });
    };
    MathStream.prototype.ceil = function () {
        return this._middlewareAdd(Math.ceil);
    };
    MathStream.prototype.cos = function () {
        return this._middlewareAdd(Math.cos);
    };
    MathStream.prototype.floor = function () {
        return this._middlewareAdd(Math.floor);
    };
    MathStream.prototype.log = function () {
        return this._middlewareAdd(Math.log);
    };
    MathStream.prototype.max = function () {
        var max;
        return this._middlewareAdd(function (data) {
            max = max === void 0 ? data : (max > data ? max : data);
            return max;
        });
    };
    MathStream.prototype.min = function () {
        var min;
        return this._middlewareAdd(function (data) {
            min = min === void 0 ? data : (min < data ? min : data);
            return min;
        });
    };
    MathStream.prototype.reduce = function (reducer) {
        var _this = this;
        var accumulator = this._accumulator;
        return this._middlewareAdd(function (data) {
            accumulator = reducer(accumulator, data, _this._transmittedCount + 1);
            return accumulator;
        });
    };
    MathStream.prototype.mul = function () {
        var accumulator = this._accumulator || 1;
        return this._middlewareAdd(function (data) {
            accumulator *= data;
            return accumulator;
        });
    };
    MathStream.prototype.round = function () {
        return this._middlewareAdd(Math.round);
    };
    MathStream.prototype.sin = function () {
        return this._middlewareAdd(Math.sin);
    };
    MathStream.prototype.sqrt = function () {
        return this._middlewareAdd(Math.sqrt);
    };
    MathStream.prototype.sum = function () {
        var accumulator = this._accumulator;
        return this._middlewareAdd(function (data) {
            accumulator += data;
            return accumulator;
        });
    };
    return MathStream;
}(stream_1.Stream));
exports.MathStream = MathStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aF9zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXh0cmEvbWF0aF9zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0NBQWlDO0FBRWpDO0lBQWdDLDhCQUFjO0lBRTFDLG9CQUE2QixZQUF3QjtRQUF4Qiw2QkFBQSxFQUFBLGdCQUF3QjtRQUFyRCxZQUNJLGlCQUFPLFNBQ1Y7UUFGNEIsa0JBQVksR0FBWixZQUFZLENBQVk7O0lBRXJELENBQUM7SUFFRCxzQkFBVyxrQ0FBVTthQUFyQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLFVBQVUsRUFBVSxDQUFDO1FBQ3BDLENBQUM7OztPQUFBO0lBRU0sd0JBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sNEJBQU8sR0FBZDtRQUFBLGlCQUVDO1FBREcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZLElBQUssT0FBQSxJQUFJLEdBQUcsQ0FBQyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQW5DLENBQW1DLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRU0seUJBQUksR0FBWDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sMEJBQUssR0FBWjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FB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