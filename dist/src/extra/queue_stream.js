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
var QueueStream = /** @class */ (function (_super) {
    __extends(QueueStream, _super);
    function QueueStream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._queue = [];
        return _this;
    }
    QueueStream.prototype.emit = function (data) {
        this.append(data);
        return this;
    };
    QueueStream.prototype.append = function (data) {
        this._queue.push(data);
        return this;
    };
    QueueStream.prototype._emitQueue = function () {
    };
    return QueueStream;
}(stream_1.Stream));
exports.QueueStream = QueueStream;
