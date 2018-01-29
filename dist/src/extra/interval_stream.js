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
var IntervalStream = /** @class */ (function (_super) {
    __extends(IntervalStream, _super);
    function IntervalStream(seconds) {
        var _this = _super.call(this) || this;
        _this._ticks = 0;
        _this._interval = setInterval(function () { return _super.prototype.emit.call(_this, _this._ticks++); }, seconds * 1000);
        return _this;
    }
    Object.defineProperty(IntervalStream.prototype, "ticks", {
        get: function () {
            return this._ticks;
        },
        enumerable: true,
        configurable: true
    });
    IntervalStream.prototype.complete = function () {
        clearInterval(this._interval);
        return _super.prototype.complete.call(this);
    };
    return IntervalStream;
}(stream_1.Stream));
exports.IntervalStream = IntervalStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWxfc3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V4dHJhL2ludGVydmFsX3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxvQ0FBaUM7QUFFakM7SUFBdUMsa0NBQWdCO0lBS25ELHdCQUFtQixPQUFlO1FBQWxDLFlBQ0ksaUJBQU8sU0FHVjtRQU5TLFlBQU0sR0FBVyxDQUFDLENBQUM7UUFLekIsS0FBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsY0FBTSxPQUFBLGlCQUFNLElBQUksYUFBQyxLQUFJLENBQUMsTUFBTSxFQUFHLENBQUMsRUFBMUIsQ0FBMEIsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7O0lBQ25GLENBQUM7SUFFRCxzQkFBVyxpQ0FBSzthQUFoQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7OztPQUFBO0lBRU0saUNBQVEsR0FBZjtRQUNJLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFOUIsTUFBTSxDQUFDLGlCQUFNLFFBQVEsV0FBRSxDQUFDO0lBQzVCLENBQUM7SUFFTCxxQkFBQztBQUFELENBQUMsQUFyQkQsQ0FBdUMsZUFBTSxHQXFCNUM7QUFyQlksd0NBQWMifQ==