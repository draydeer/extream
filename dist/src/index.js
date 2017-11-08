"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_w3cwebsocket_stream_1 = require("./extra/websocket_w3cwebsocket_stream");
var w = new websocket_w3cwebsocket_stream_1.WebsocketW3CWebsocketStream('ws://127.0.0.1:9999/echo').filter(function (m) { return m == "11" || m == "22"; });
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
