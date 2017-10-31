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
var websocket_1 = require("websocket");
var W3CWebSocketStream = (function (_super) {
    __extends(W3CWebSocketStream, _super);
    function W3CWebSocketStream(url) {
        var _this = _super.call(this) || this;
        var client = new websocket_1.w3cwebsocket(url);
        _this.pause();
        client.onclose = _super.prototype.complete.bind(_this);
        client.onerror = _super.prototype.error.bind(_this);
        client.onmessage = function (data) { return _super.prototype.emit.call(_this, data.data); };
        client.onopen = _super.prototype.resume.bind(_this);
        _this._client = client;
        return _this;
    }
    W3CWebSocketStream.prototype.emit = function (data) {
        if (this._client.readyState === this._client.OPEN) {
            this._client.send(data);
        }
        return this;
    };
    return W3CWebSocketStream;
}(stream_1.Stream));
exports.W3CWebSocketStream = W3CWebSocketStream;
