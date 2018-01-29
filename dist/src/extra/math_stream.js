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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aF9zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXh0cmEvbWF0aF9zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0NBQWlDO0FBRWpDO0lBQWdDLDhCQUFjO0lBSzFDLG9CQUE2QixZQUF3QjtRQUF4Qiw2QkFBQSxFQUFBLGdCQUF3QjtRQUFyRCxZQUNJLGlCQUFPLFNBQ1Y7UUFGNEIsa0JBQVksR0FBWixZQUFZLENBQVk7O0lBRXJELENBQUM7SUFFRCxzQkFBVyxrQ0FBVTthQUFyQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLFVBQVUsRUFBVSxDQUFDO1FBQ3BDLENBQUM7OztPQUFBO0lBRU0sd0JBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsSUFBWSxJQUFLLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU0sNEJBQU8sR0FBZDtRQUFBLGlCQUVDO1FBREcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZLElBQUssT0FBQSxJQUFJLEdBQUcsQ0FBQyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQW5DLENBQW1DLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUFBLGlCQU1DO1FBTEcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZO1lBQ3BDLEtBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVoRixNQUFNLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSx3QkFBRyxHQUFWO1FBQUEsaUJBTUM7UUFMRyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFDLElBQVk7WUFDcEMsS0FBSSxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWhGLE1BQU0sQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLDJCQUFNLEdBQWIsVUFBYyxPQUFzRTtRQUFwRixpQkFNQztRQUxHLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsSUFBWTtZQUNwQyxLQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFakYsTUFBTSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUFBLGlCQUVDO1FBREcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZLElBQUssT0FBQSxLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSSxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQW5ELENBQW1ELENBQUMsQ0FBQztJQUN0RyxDQUFDO0lBRU0seUJBQUksR0FBWDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsSUFBWSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBZixDQUFlLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUFBLGlCQUVDO1FBREcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZLElBQUssT0FBQSxLQUFJLENBQUMsWUFBWSxJQUFJLElBQUksRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFTCxpQkFBQztBQUFELENBQUMsQUF6REQsQ0FBZ0MsZUFBTSxHQXlEckM7QUF6RFksZ0NBQVUifQ==