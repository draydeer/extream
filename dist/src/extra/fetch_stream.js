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
var FetchStream = /** @class */ (function (_super) {
    __extends(FetchStream, _super);
    function FetchStream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._queue = [];
        return _this;
    }
    FetchStream.prototype.emit = function (data) {
        throw new Error("Emitting is not allowed.");
    };
    FetchStream.prototype.delete = function (url) {
        return this.fork();
    };
    FetchStream.prototype.get = function (url) {
        return this.fork();
    };
    FetchStream.prototype.post = function (url) {
        return this.fork();
    };
    FetchStream.prototype.put = function (url) {
        return this.fork();
    };
    return FetchStream;
}(stream_1.Stream));
exports.FetchStream = FetchStream;
