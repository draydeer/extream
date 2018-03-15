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
var W3CWebsocketStream = /** @class */ (function (_super) {
    __extends(W3CWebsocketStream, _super);
    function W3CWebsocketStream(url) {
        var _this = _super.call(this) || this;
        _this.init(url);
        return _this;
    }
    W3CWebsocketStream.prototype.emit = function (data, subscribers) {
        if (this._client.readyState === this._client.OPEN) {
            this._client.send(String(data));
        }
        return this;
    };
    W3CWebsocketStream.prototype.init = function (url) {
        var client = new websocket_1.w3cwebsocket(url);
        this.pause();
        client.onclose = this.onComplete.bind(this);
        client.onerror = this.onError.bind(this);
        client.onmessage = this.onData.bind(this);
        client.onopen = _super.prototype.resume.bind(this);
        this._client = client;
    };
    W3CWebsocketStream.prototype.onComplete = function () {
        _super.prototype.complete.call(this);
    };
    W3CWebsocketStream.prototype.onData = function (data) {
        _super.prototype.emit.call(this, data.data);
    };
    W3CWebsocketStream.prototype.onError = function (error) {
        _super.prototype.error.call(this, error);
    };
    return W3CWebsocketStream;
}(stream_1.Stream));
exports.W3CWebsocketStream = W3CWebsocketStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidzNjd2Vic29ja2V0X3N0cmVhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHRyYS93M2N3ZWJzb2NrZXRfc3RyZWFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG9DQUFpQztBQUNqQyx1Q0FBMEQ7QUFJMUQ7SUFBMkMsc0NBQVM7SUFJaEQsNEJBQW1CLEdBQVc7UUFBOUIsWUFDSSxpQkFBTyxTQUdWO1FBREcsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7SUFDbkIsQ0FBQztJQUVNLGlDQUFJLEdBQVgsVUFBWSxJQUFPLEVBQUUsV0FBc0M7UUFDdkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFUyxpQ0FBSSxHQUFkLFVBQWUsR0FBVztRQUN0QixJQUFNLE1BQU0sR0FBRyxJQUFJLHdCQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxpQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFUyx1Q0FBVSxHQUFwQjtRQUNJLGlCQUFNLFFBQVEsV0FBRSxDQUFDO0lBQ3JCLENBQUM7SUFFUyxtQ0FBTSxHQUFoQixVQUFpQixJQUFTO1FBQ3RCLGlCQUFNLElBQUksWUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVTLG9DQUFPLEdBQWpCLFVBQWtCLEtBQVU7UUFDeEIsaUJBQU0sS0FBSyxZQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFTCx5QkFBQztBQUFELENBQUMsQUEzQ0QsQ0FBMkMsZUFBTSxHQTJDaEQ7QUEzQ1ksZ0RBQWtCIn0=