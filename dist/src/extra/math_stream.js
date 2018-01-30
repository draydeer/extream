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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aF9zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXh0cmEvbWF0aF9zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0NBQWlDO0FBRWpDO0lBQWdDLDhCQUFjO0lBRTFDLG9CQUE2QixZQUF3QjtRQUF4Qiw2QkFBQSxFQUFBLGdCQUF3QjtRQUFyRCxZQUNJLGlCQUFPLFNBQ1Y7UUFGNEIsa0JBQVksR0FBWixZQUFZLENBQVk7O0lBRXJELENBQUM7SUFFRCxzQkFBVyxrQ0FBVTthQUFyQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLFVBQVUsRUFBVSxDQUFDO1FBQ3BDLENBQUM7OztPQUFBO0lBRU0sd0JBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sNEJBQU8sR0FBZDtRQUFBLGlCQUVDO1FBREcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZLElBQUssT0FBQSxJQUFJLEdBQUcsQ0FBQyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQW5DLENBQW1DLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRU0seUJBQUksR0FBWDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sMEJBQUssR0FBWjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUNJLElBQUksR0FBRyxDQUFDO1FBRVIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZO1lBQ3BDLEdBQUcsR0FBRyxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXhELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSx3QkFBRyxHQUFWO1FBQ0ksSUFBSSxHQUFHLENBQUM7UUFFUixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFDLElBQVk7WUFDcEMsR0FBRyxHQUFHLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLHdCQUFHLEdBQVYsVUFBVyxXQUFvQjtRQUMzQixXQUFXLEdBQUcsV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO1FBRXBELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsSUFBWTtZQUNwQyxXQUFXLElBQUksSUFBSSxDQUFDO1lBRXBCLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sMEJBQUssR0FBWjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sd0JBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0seUJBQUksR0FBWDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sd0JBQUcsR0FBVixVQUFXLFdBQW9CO1FBQzNCLFdBQVcsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7UUFFcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFZO1lBQ3BDLFdBQVcsSUFBSSxJQUFJLENBQUM7WUFFcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTCxpQkFBQztBQUFELENBQUMsQUF0RkQsQ0FBZ0MsZUFBTSxHQXNGckM7QUF0RlksZ0NBQVUifQ==