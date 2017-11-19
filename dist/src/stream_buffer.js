"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StreamBuffer = /** @class */ (function () {
    function StreamBuffer(maxLength) {
        if (maxLength === void 0) { maxLength = 0; }
        this._buffer = [];
        this._maxLength = 0;
        this._maxLength = maxLength;
    }
    Object.defineProperty(StreamBuffer.prototype, "isMaxReached", {
        get: function () {
            return this._maxLength === 0 || this._maxLength === this._buffer.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StreamBuffer.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    StreamBuffer.prototype.push = function (data) {
        if (this.isMaxReached) {
            return false;
        }
        this._buffer.push(data);
        return true;
    };
    StreamBuffer.prototype.flush = function () {
        this._buffer = [];
        return this;
    };
    return StreamBuffer;
}());
exports.StreamBuffer = StreamBuffer;
