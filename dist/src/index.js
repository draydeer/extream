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
var stream_1 = require("./stream");
var w3cwebsocket_stream_1 = require("./extra/w3cwebsocket_stream");
var WebSocketClient = require('websocket').w3cwebsocket;
var WebSocketStream = (function (_super) {
    __extends(WebSocketStream, _super);
    function WebSocketStream() {
        var _this = _super.call(this) || this;
        var client = new WebSocketClient('ws://127.0.0.1:9999/echo');
        _this.pause();
        client.onclose = _super.prototype.complete.bind(_this);
        client.onerror = _super.prototype.error.bind(_this);
        client.onmessage = function (data) { return _super.prototype.emit.call(_this, data.data); };
        client.onopen = _super.prototype.resume.bind(_this);
        _this._client = client;
        return _this;
    }
    WebSocketStream.prototype.emit = function (data) {
        if (this._client.readyState === this._client.OPEN) {
            this._client.send(data);
        }
        else {
            console.error("Not ready.");
        }
        return this;
    };
    return WebSocketStream;
}(stream_1.Stream));
var w = new w3cwebsocket_stream_1.W3CWebSocketStream('ws://127.0.0.1:9999/echo').filter(function (m) { return m == "11" || m == "22"; });
w.subscribe(function (data) {
    console.log("11: " + data);
}, function (error) {
    console.log(error);
}, function () {
    console.log('complete!');
});
w.fork().filter(function (m) { return m == "22"; }).subscribe(function (data) {
    console.log("22: " + data);
}, function (error) {
    console.log(error);
}, function () {
    console.log('complete!');
});
//w.toPromise().then(() => console.log('resolved!'));
setTimeout(function () {
    w.emit("1");
}, 1000);
setTimeout(function () {
    w.emit("2");
}, 2000);
setTimeout(function () {
    w.emit("3");
}, 3000);
setTimeout(function () { }, 1000000);
