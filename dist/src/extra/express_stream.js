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
var express = require("express");
var qs = require("querystring");
var const_1 = require("../const");
var msg_1 = require("../msg");
var stream_1 = require("../stream");
exports.EXPRESS_STREAM_REQUEST_MSG = { type: 'request' };
exports.EXPRESS_STREAM_ROUTE_REGISTERED_MSG = { type: 'routeRegistered' };
exports.EXPRESS_STREAM_STARTED_MSG = { type: 'started' };
var ExpressStream = /** @class */ (function (_super) {
    __extends(ExpressStream, _super);
    function ExpressStream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._app = express();
        _this._routers = {};
        _this._withPrefix = '/';
        return _this;
    }
    Object.defineProperty(ExpressStream.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    ExpressStream.prototype.getExpressRouter = function (prefix) {
        if (!(prefix in this._routers)) {
            this._routers[prefix] = express.Router();
        }
        return this._routers[prefix];
    };
    ExpressStream.prototype.handle = function (route, method) {
        var _this = this;
        if (method === void 0) { method = 'get'; }
        switch (method) {
            case 'all':
            case 'delete':
            case 'get':
            case 'patch':
            case 'post':
            case 'put':
                var routeHandlerStream_1 = new ExpressHandlerStream(this);
                this.getExpressRouter(this._withPrefix)[method](route, function (req, res, next) {
                    _this.emit(msg_1.makeBy(exports.EXPRESS_STREAM_REQUEST_MSG, { method: method, route: route, req: req, res: res }));
                    var sessionStream = new ExpressSessionStream(req, res);
                    //sessionStream.emit(sessionStream, routeHandlerStream.subscribers);
                    routeHandlerStream_1.emit(new ExpressSessionStream(req, res));
                });
                this.emit(msg_1.makeBy(exports.EXPRESS_STREAM_ROUTE_REGISTERED_MSG, { method: method, route: route }));
                return routeHandlerStream_1;
        }
        throw new Error("Unsupported method: " + method);
    };
    ExpressStream.prototype.start = function (port) {
        var _this = this;
        if (port === void 0) { port = 8080; }
        Object.keys(this._routers).forEach(function (key) { return _this._app.use(key, _this._routers[key]); });
        this._app.listen(port, function () { return _this.emit(exports.EXPRESS_STREAM_STARTED_MSG); });
        return this;
    };
    ExpressStream.prototype.withPrefix = function (prefix) {
        this._withPrefix = prefix;
        return this;
    };
    return ExpressStream;
}(stream_1.Stream));
exports.ExpressStream = ExpressStream;
var ExpressHandlerStream = /** @class */ (function (_super) {
    __extends(ExpressHandlerStream, _super);
    function ExpressHandlerStream(_stream) {
        var _this = _super.call(this) || this;
        _this._stream = _stream;
        return _this;
    }
    ExpressHandlerStream.prototype.handle = function (route, method) {
        if (method === void 0) { method = 'get'; }
        return this._stream.handle(route, method);
    };
    ExpressHandlerStream.prototype.withPrefix = function (prefix) {
        return this._stream.withPrefix(prefix);
    };
    // middlewares
    ExpressHandlerStream.prototype.extractBody = function () {
        var _this = this;
        this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            data.body = '';
            data.req
                .on('data', function (chunk) { return data.body = data.body + chunk.toString(); })
                .on('end', function () { return _this._emitLoop(subscribers, middlewareIndex, cb, data); })
                .on('error', function (err) { return _this.error(err); });
            return const_1.CANCELLED;
        });
        return this;
    };
    ExpressHandlerStream.prototype.extractForm = function () {
        var _this = this;
        this._middlewareAdd(function (session) {
            try {
                session.body = qs.parse(session.body);
                return session;
            }
            catch (err) {
                _this.error(err);
                return const_1.CANCELLED;
            }
        });
        return this;
    };
    ExpressHandlerStream.prototype.extractJson = function () {
        var _this = this;
        this._middlewareAdd(function (session) {
            try {
                session.body = JSON.parse(session.body);
                return session;
            }
            catch (err) {
                _this.error(err);
                return const_1.CANCELLED;
            }
        });
        return this;
    };
    return ExpressHandlerStream;
}(stream_1.Stream));
exports.ExpressHandlerStream = ExpressHandlerStream;
var ExpressSessionStream = /** @class */ (function (_super) {
    __extends(ExpressSessionStream, _super);
    function ExpressSessionStream(_req, _res) {
        var _this = _super.call(this) || this;
        _this._req = _req;
        _this._res = _res;
        return _this;
    }
    Object.defineProperty(ExpressSessionStream.prototype, "req", {
        get: function () {
            return this._req;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpressSessionStream.prototype, "res", {
        get: function () {
            return this._res;
        },
        enumerable: true,
        configurable: true
    });
    ExpressSessionStream.prototype.status = function (status) {
        this._res.status(status);
        return this;
    };
    ExpressSessionStream.prototype._shutdown = function () {
        _super.prototype._shutdown.call(this);
        this._req = this._res = void 0;
        return this;
    };
    ExpressSessionStream.prototype._subscriberOnData = function (data, subscribers) {
        _super.prototype._subscriberOnData.call(this, data, subscribers);
        if (this._res) {
            this._res.send(data);
        }
        return this;
    };
    ExpressSessionStream.prototype._subscriberOnComplete = function (subscribers) {
        _super.prototype._subscriberOnComplete.call(this, subscribers);
        if (this._res) {
            this._res.end();
        }
        return this;
    };
    return ExpressSessionStream;
}(stream_1.Stream));
exports.ExpressSessionStream = ExpressSessionStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc19zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXh0cmEvZXhwcmVzc19zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUNsQyxrQ0FBbUM7QUFDbkMsOEJBQW1DO0FBQ25DLG9DQUFpQztBQUdwQixRQUFBLDBCQUEwQixHQUFRLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDO0FBQ3BELFFBQUEsbUNBQW1DLEdBQVEsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztBQUNyRSxRQUFBLDBCQUEwQixHQUFRLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDO0FBRWpFO0lBQXNDLGlDQUFXO0lBQWpEO1FBQUEscUVBNERDO1FBMURhLFVBQUksR0FBb0IsT0FBTyxFQUFFLENBQUM7UUFDbEMsY0FBUSxHQUFvQyxFQUFFLENBQUM7UUFDL0MsaUJBQVcsR0FBVyxHQUFHLENBQUM7O0lBd0R4QyxDQUFDO0lBdERHLHNCQUFXLDhCQUFHO2FBQWQ7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDOzs7T0FBQTtJQUVNLHdDQUFnQixHQUF2QixVQUF3QixNQUFjO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM3QyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVNLDhCQUFNLEdBQWIsVUFBYyxLQUFLLEVBQUUsTUFBWTtRQUFqQyxpQkEwQkM7UUExQm9CLHVCQUFBLEVBQUEsY0FBWTtRQUM3QixN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