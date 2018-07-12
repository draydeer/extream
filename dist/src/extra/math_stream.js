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
    MathStream.prototype.getCompatible = function () {
        return new MathStream();
    };
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
    MathStream.prototype.mul = function (accumulator) {
        accumulator = accumulator || this._accumulator || 1;
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
    MathStream.prototype.sum = function (accumulator) {
        accumulator = accumulator || this._accumulator || 0;
        return this._middlewareAdd(function (data) {
            accumulator += data;
            return accumulator;
        });
    };
    return MathStream;
}(stream_1.Stream));
exports.MathStream = MathStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aF9zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXh0cmEvbWF0aF9zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0NBQWlDO0FBRWpDO0lBQWdDLDhCQUFjO0lBRTFDLG9CQUE2QixZQUF3QjtRQUF4Qiw2QkFBQSxFQUFBLGdCQUF3QjtRQUFyRCxZQUNJLGlCQUFPLFNBQ1Y7UUFGNEIsa0JBQVksR0FBWixZQUFZLENBQVk7O0lBRXJELENBQUM7SUFFTSxrQ0FBYSxHQUFwQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLFVBQVUsRUFBVSxDQUFDO0lBQ3BDLENBQUM7SUFFTSx3QkFBRyxHQUFWO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSw0QkFBTyxHQUFkO1FBQUEsaUJBRUM7UUFERyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFDLElBQVksSUFBSyxPQUFBLElBQUksR0FBRyxDQUFDLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFFTSx5QkFBSSxHQUFYO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSx3QkFBRyxHQUFWO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSwwQkFBSyxHQUFaO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTSx3QkFBRyxHQUFWO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSx3QkFBRyxHQUFWO1FBQ0ksSUFBSSxHQUFHLENBQUM7UUFFUixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFDLElBQVk7WUFDcEMsR0FBRyxHQUFHLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLHdCQUFHLEdBQVY7UUFDSSxJQUFJLEdBQUcsQ0FBQztRQUVSLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsSUFBWTtZQUNwQyxHQUFHLEdBQUcsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV4RCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sd0JBQUcsR0FBVixVQUFXLFdBQW9CO1FBQzNCLFdBQVcsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7UUFFcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZO1lBQ3BDLFdBQVcsSUFBSSxJQUFJLENBQUM7WUFFcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSwwQkFBSyxHQUFaO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTSx3QkFBRyxHQUFWO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSx5QkFBSSxHQUFYO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSx3QkFBRyxHQUFWLFVBQVcsV0FBb0I7UUFDM0IsV0FBVyxHQUFHLFdBQVcsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQztRQUVwRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFDLElBQVk7WUFDcEMsV0FBVyxJQUFJLElBQUksQ0FBQztZQUVwQixNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVMLGlCQUFDO0FBQUQsQ0FBQyxBQXRGRCxDQUFnQyxlQUFNLEdBc0ZyQztBQXRGWSxnQ0FBVSJ9