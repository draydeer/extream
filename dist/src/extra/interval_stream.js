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
    function IntervalStream(_seconds) {
        var _this = _super.call(this) || this;
        _this._seconds = _seconds;
        _this._ticks = 0;
        return _this;
    }
    Object.defineProperty(IntervalStream.prototype, "ticks", {
        get: function () {
            return this._ticks;
        },
        enumerable: true,
        configurable: true
    });
    IntervalStream.prototype.cold = function () {
        this._tickStart();
        return this;
    };
    IntervalStream.prototype.complete = function () {
        this._tickStop();
        return _super.prototype.complete.call(this);
    };
    IntervalStream.prototype._tickEmit = function () {
        this._ticks += 1;
        _super.prototype.emit.call(this, this._ticks);
    };
    IntervalStream.prototype._tickStart = function () {
        var _this = this;
        if (!this._interval) {
            this._interval = setInterval(function () {
                _this._tickEmit();
            }, this._seconds * 1000);
        }
    };
    IntervalStream.prototype._tickStop = function () {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = void 0;
        }
    };
    IntervalStream.prototype.onSubscriberAdd = function (subscriber) {
        if (!this._isCold) {
            this._tickStart();
        }
        return _super.prototype.onSubscriberAdd.call(this, subscriber);
    };
    IntervalStream.prototype.onSubscriberRemove = function (subscriber) {
        if (!this._isCold && this.subscribersCount === 0) {
            this._tickStop();
        }
        return _super.prototype.onSubscriberRemove.call(this, subscriber);
    };
    return IntervalStream;
}(stream_1.Stream));
exports.IntervalStream = IntervalStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWxfc3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V4dHJhL2ludGVydmFsX3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvQ0FBaUM7QUFHakM7SUFBdUMsa0NBQWdCO0lBS25ELHdCQUE2QixRQUFnQjtRQUE3QyxZQUNJLGlCQUFPLFNBQ1Y7UUFGNEIsY0FBUSxHQUFSLFFBQVEsQ0FBUTtRQUZuQyxZQUFNLEdBQVcsQ0FBQyxDQUFDOztJQUk3QixDQUFDO0lBRUQsc0JBQVcsaUNBQUs7YUFBaEI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVNLDZCQUFJLEdBQVg7UUFDSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFbEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0saUNBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVqQixNQUFNLENBQUMsaUJBQU0sUUFBUSxXQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVTLGtDQUFTLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFFakIsaUJBQU0sSUFBSSxZQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRVMsbUNBQVUsR0FBcEI7UUFBQSxpQkFNQztRQUxHLEVBQUUsQ0FBQyxDQUFDLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7Z0JBQ3pCLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNyQixDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDO0lBQ0wsQ0FBQztJQUVTLGtDQUFTLEdBQW5CO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakIsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUU5QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7SUFDTCxDQUFDO0lBRVMsd0NBQWUsR0FBekIsVUFBMEIsVUFBeUM7UUFDL0QsRUFBRSxDQUFDLENBQUMsQ0FBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdEIsQ0FBQztRQUVELE1BQU0sQ0FBQyxpQkFBTSxlQUFlLFlBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVTLDJDQUFrQixHQUE1QixVQUE2QixVQUF5QztRQUNsRSxFQUFFLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFFRCxNQUFNLENBQUMsaUJBQU0sa0JBQWtCLFlBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVMLHFCQUFDO0FBQUQsQ0FBQyxBQS9ERCxDQUF1QyxlQUFNLEdBK0Q1QztBQS9EWSx3Q0FBYyJ9