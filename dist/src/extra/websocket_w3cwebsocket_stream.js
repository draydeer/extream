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
var WebsocketW3CWebsocketStream = /** @class */ (function (_super) {
    __extends(WebsocketW3CWebsocketStream, _super);
    function WebsocketW3CWebsocketStream(url) {
        var _this = _super.call(this) || this;
        _this.init(url);
        return _this;
    }
    WebsocketW3CWebsocketStream.prototype.emit = function (data, subscribers) {
        if (this._client.readyState === this._client.OPEN) {
            this._client.send(String(data));
        }
        return this;
    };
    WebsocketW3CWebsocketStream.prototype.init = function (url) {
        var client = new websocket_1.w3cwebsocket(url);
        this.pause();
        client.onclose = this.onComplete.bind(this);
        client.onerror = this.onError.bind(this);
        client.onmessage = this.onData.bind(this);
        client.onopen = _super.prototype.resume.bind(this);
        this._client = client;
    };
    WebsocketW3CWebsocketStream.prototype.onComplete = function () {
        _super.prototype.complete.call(this);
    };
    WebsocketW3CWebsocketStream.prototype.onData = function (data) {
        _super.prototype.emit.call(this, data.data);
    };
    WebsocketW3CWebsocketStream.prototype.onError = function (error) {
        _super.prototype.error.call(this, error);
    };
    return WebsocketW3CWebsocketStream;
}(stream_1.Stream));
exports.WebsocketW3CWebsocketStream = WebsocketW3CWebsocketStream;
