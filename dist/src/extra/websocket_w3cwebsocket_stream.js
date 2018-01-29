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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0X3czY3dlYnNvY2tldF9zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXh0cmEvd2Vic29ja2V0X3czY3dlYnNvY2tldF9zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0NBQWlDO0FBQ2pDLHVDQUEwRDtBQUkxRDtJQUFvRCwrQ0FBUztJQUl6RCxxQ0FBbUIsR0FBVztRQUE5QixZQUNJLGlCQUFPLFNBR1Y7UUFERyxLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUNuQixDQUFDO0lBRU0sMENBQUksR0FBWCxVQUFZLElBQU8sRUFBRSxXQUFzQztRQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVTLDBDQUFJLEdBQWQsVUFBZSxHQUFXO1FBQ3RCLElBQU0sTUFBTSxHQUFHLElBQUksd0JBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFYixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsTUFBTSxHQUFHLGlCQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVTLGdEQUFVLEdBQXBCO1FBQ0ksaUJBQU0sUUFBUSxXQUFFLENBQUM7SUFDckIsQ0FBQztJQUVTLDRDQUFNLEdBQWhCLFVBQWlCLElBQVM7UUFDdEIsaUJBQU0sSUFBSSxZQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRVMsNkNBQU8sR0FBakIsVUFBa0IsS0FBVTtRQUN4QixpQkFBTSxLQUFLLFlBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVMLGtDQUFDO0FBQUQsQ0FBQyxBQTNDRCxDQUFvRCxlQUFNLEdBMkN6RDtBQTNDWSxrRUFBMkIifQ==