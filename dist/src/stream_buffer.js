"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var iteratorDone = { done: true };
var iteratorNext = { done: false, value: void 0 };
var StreamBuffer = /** @class */ (function () {
    function StreamBuffer(size, preallocate) {
        if (size === void 0) { size = 10; }
        this._headIndex = 0;
        this._tailIndex = 0;
        if (size < 1) {
            throw new Error('Size must be >= 0');
        }
        this._size = size;
        if (preallocate) {
            this._buffer = new Array(size);
        }
    }
    Object.defineProperty(StreamBuffer.prototype, "isEmpty", {
        get: function () {
            return this._headIndex === this._tailIndex;
        },
        enumerable: true,
        configurable: true
    });
    StreamBuffer.prototype.next = function () {
        if (this.isEmpty) {
            return iteratorDone;
        }
        iteratorNext.value = this.shift();
        return iteratorNext;
    };
    StreamBuffer.prototype.flush = function () {
        this._buffer = [];
        this._headIndex = this._tailIndex = 0;
        return this;
    };
    StreamBuffer.prototype.add = function (data) {
        if (this._buffer === void 0) {
            this._buffer = [];
        }
        if (this._buffer.length < this._size) {
            this._buffer.push(data);
        }
        else {
            if (this._headIndex - this._tailIndex === this._size) {
                throw new errors_1.BufferIsFullError();
            }
            this._buffer[this._headIndex % this._size] = data;
        }
        this._headIndex++;
        return this;
    };
    StreamBuffer.prototype.shift = function () {
        if (this._headIndex === this._tailIndex) {
            throw new errors_1.BufferIsEmptyError();
        }
        var data = this._buffer[this._tailIndex % this._size];
        this._buffer[this._tailIndex % this._size] = null;
        this._tailIndex++;
        return data;
    };
    return StreamBuffer;
}());
exports.StreamBuffer = StreamBuffer;
