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
            throw new Error('Size must be >= 1');
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
        this._headIndex += 1;
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
        this._tailIndex += 1;
        return data;
    };
    return CyclicBuffer;
}());
exports.CyclicBuffer = CyclicBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2J1ZmZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUErRDtBQUcvRCxJQUFNLFlBQVksR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDbkQsSUFBTSxZQUFZLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDO0FBRXBEO0lBTUksc0JBQTZCLEtBQWtCLEVBQVksWUFBc0I7UUFBcEQsc0JBQUEsRUFBQSxVQUFrQjtRQUFsQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQVksaUJBQVksR0FBWixZQUFZLENBQVU7UUFIdkUsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRzdCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBSSxLQUFLLENBQUMsQ0FBQztRQUN2QyxDQUFDO0lBQ0wsQ0FBQztJQUVELHNCQUFXLGlDQUFPO2FBQWxCO1lBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxJQUFJLDJCQUFrQixFQUFFLENBQUM7WUFDbkMsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELENBQUM7OztPQUFBO0lBRUQsc0JBQVcs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