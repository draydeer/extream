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
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this._interval = setInterval.apply(void 0, [_this.emit.bind(_this), seconds * 1000].concat(args));
        return _this;
    }
    IntervalStream.prototype.complete = function () {
        console.log('iterval!');
        clearInterval(this._interval);
        return _super.prototype.complete.call(this);
    };
    return IntervalStream;
}(stream_1.Stream));
exports.IntervalStream = IntervalStream;
