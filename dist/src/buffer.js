"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var iteratorDone = { done: true, value: void 0 };
var iteratorNext = { done: false, value: void 0 };
var CyclicBuffer = /** @class */ (function () {
    function CyclicBuffer(_size, _preallocate) {
        if (_size === void 0) { _size = 10; }
        this._size = _size;
        this._preallocate = _preallocate;
        this._headIndex = 0;
        this._tailIndex = 0;
        if (_size < 1) {
            throw new Error('Size must be >= 0');
        }
        if (_preallocate) {
            this._buffer = new Array(_size);
        }
    }
    Object.defineProperty(CyclicBuffer.prototype, "current", {
        get: function () {
            if (this._headIndex === this._tailIndex) {
                throw new errors_1.BufferIsEmptyError();
            }
            return this._buffer[this._tailIndex % this._size];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CyclicBuffer.prototype, "isEmpty", {
        get: function () {
            return this._headIndex === this._tailIndex;
        },
        enumerable: true,
        configurable: true
    });
    CyclicBuffer.prototype.add = function (data) {
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
    CyclicBuffer.prototype.flush = function () {
        this._buffer = this._preallocate ? new Array(this._size) : [];
        this._headIndex = 0;
        this._tailIndex = 0;
        return this;
    };
    CyclicBuffer.prototype.next = function () {
        if (this._headIndex === this._tailIndex) {
            return iteratorDone;
        }
        iteratorNext.value = this.shift();
        return iteratorNext;
    };
    CyclicBuffer.prototype.shift = function () {
        if (this._headIndex === this._tailIndex) {
            throw new errors_1.BufferIsEmptyError();
        }
        var data = this._buffer[this._tailIndex % this._size];
        this._buffer[this._tailIndex % this._size] = null;
        this._tailIndex++;
        return data;
    };
    return CyclicBuffer;
}());
exports.CyclicBuffer = CyclicBuffer;
