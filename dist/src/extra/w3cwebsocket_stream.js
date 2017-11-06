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
        _this.init(url);
        return _this;
    }
    W3CWebSocketStream.prototype.emit = function (data) {
        if (this._client.readyState === this._client.OPEN) {
            this._client.send(String(data));
        }
        return this;
    };
    W3CWebSocketStream.prototype.init = function (url) {
        var client = new websocket_1.w3cwebsocket(url);
        this.pause();
        client.onclose = this.onComplete.bind(this);
        client.onerror = this.onError.bind(this);
        client.onmessage = this.onData.bind(this);
        client.onopen = _super.prototype.resume.bind(this);
        this._client = client;
    };
    W3CWebSocketStream.prototype.onComplete = function () {
        _super.prototype.complete.call(this);
    };
    W3CWebSocketStream.prototype.onData = function (data) {
        _super.prototype.emit.call(this, data.data);
    };
    W3CWebSocketStream.prototype.onError = function (error) {
        _super.prototype.error.call(this, error);
    };
    return W3CWebSocketStream;
}(stream_1.Stream));
exports.W3CWebSocketStream = W3CWebSocketStream;
