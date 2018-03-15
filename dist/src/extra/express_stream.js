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
        return _this;
    }
    Object.defineProperty(ExpressStream.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    ExpressStream.prototype.handle = function (route, method) {
        if (method === void 0) { method = 'get'; }
        return this.router().handle(route, method);
    };
    ExpressStream.prototype.router = function (prefix) {
        if (prefix === void 0) { prefix = '/'; }
        if (!(prefix in this._routers)) {
            this._routers[prefix] = new ExpressRouterStream(this, prefix);
        }
        return this._routers[prefix];
    };
    ExpressStream.prototype.start = function (port) {
        var _this = this;
        if (port === void 0) { port = 8080; }
        Object.keys(this._routers).forEach(function (key) { return _this._routers[key].start(); });
        this._app.listen(port, function () { return _this.emit(exports.EXPRESS_STREAM_STARTED_MSG); });
        return this;
    };
    return ExpressStream;
}(stream_1.Stream));
exports.ExpressStream = ExpressStream;
var ExpressRouterStream = /** @class */ (function (_super) {
    __extends(ExpressRouterStream, _super);
    function ExpressRouterStream(_stream, _prefix) {
        if (_prefix === void 0) { _prefix = '/'; }
        var _this = _super.call(this) || this;
        _this._stream = _stream;
        _this._prefix = _prefix;
        _this._router = express.Router();
        _this.progressive();
        return _this;
    }
    ExpressRouterStream.prototype.handle = function (route, method) {
        var _this = this;
        if (method === void 0) { method = 'get'; }
        var routeHandlerStream = new ExpressRouteHandlerStream(this);
        var subscriptions = [this.subscribeStream(routeHandlerStream)];
        switch (method) {
            case 'all':
                this._router.all(route, function (req, res, next) {
                    _this.emit(new ExpressSessionStream(req, res), subscriptions);
                });
                break;
            case 'delete':
                this._router.delete(route, function (req, res, next) {
                    _this.emit(new ExpressSessionStream(req, res), subscriptions);
                });
                break;
            case 'get':
                this._router.get(route, function (req, res, next) {
                    _this.emit(new ExpressSessionStream(req, res), subscriptions);
                });
                break;
            case 'patch':
                this._router.patch(route, function (req, res, next) {
                    _this.emit(new ExpressSessionStream(req, res), subscriptions);
                });
                break;
            case 'post':
                this._router.post(route, function (req, res, next) {
                    _this.emit(new ExpressSessionStream(req, res), subscriptions);
                });
                break;
            case 'put':
                this._router.put(route, function (req, res, next) {
                    _this.emit(new ExpressSessionStream(req, res), subscriptions);
                });
                break;
            default:
                throw new Error("Unsupported method: " + method);
        }
        this._stream.emit(msg_1.makeBy(exports.EXPRESS_STREAM_ROUTE_REGISTERED_MSG, { method: method, route: route }));
        return routeHandlerStream;
    };
    ExpressRouterStream.prototype.start = function () {
        this._stream.app.use(this._prefix, this._router);
        return this;
    };
    // middlewares
    ExpressRouterStream.prototype.extractBody = function () {
        var _this = this;
        this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            data.body = '';
            data.req
                .on('data', function (chunk) { return data.body += chunk.toString(); })
                .on('end', function () { return _this._emitLoop(subscribers, middlewareIndex, cb, data); })
                .on('error', function (err) { return _this.error(err); });
            return const_1.CANCELLED;
        });
        return this;
    };
    ExpressRouterStream.prototype.extractForm = function () {
        this._middlewareAdd(function (data) {
            data.req.body = qs.parse(data.req.body);
            return data;
        });
        return this;
    };
    ExpressRouterStream.prototype.extractJson = function () {
        var _this = this;
        this._middlewareAdd(function (data) {
            try {
                data.req.body = JSON.parse(data.req.body);
                return data;
            }
            catch (err) {
                _this.error(err);
                return const_1.CANCELLED;
            }
        });
        return this;
    };
    return ExpressRouterStream;
}(stream_1.Stream));
exports.ExpressRouterStream = ExpressRouterStream;
var ExpressRouteHandlerStream = /** @class */ (function (_super) {
    __extends(ExpressRouteHandlerStream, _super);
    function ExpressRouteHandlerStream(_routerStream) {
        var _this = _super.call(this) || this;
        _this._routerStream = _routerStream;
        return _this;
    }
    Object.defineProperty(ExpressRouteHandlerStream.prototype, "router", {
        get: function () {
            return this._routerStream;
        },
        enumerable: true,
        configurable: true
    });
    // middlewares
    ExpressRouteHandlerStream.prototype.extractBody = function () {
        var _this = this;
        this._middlewareAdd(function (data, stream, subscribers, middlewareIndex, cb) {
            data.body = '';
            data.req
                .on('data', function (chunk) { return data.body += chunk.toString(); })
                .on('end', function () { return _this._emitLoop(subscribers, middlewareIndex, cb, data); })
                .on('error', function (err) { return _this.error(err); });
            return const_1.CANCELLED;
        });
        return this;
    };
    ExpressRouteHandlerStream.prototype.extractForm = function () {
        this._middlewareAdd(function (data) {
            data.req.body = qs.parse(data.req.body);
            return data;
        });
        return this;
    };
    ExpressRouteHandlerStream.prototype.extractJson = function () {
        var _this = this;
        this._middlewareAdd(function (data) {
            try {
                data.req.body = JSON.parse(data.req.body);
                return data;
            }
            catch (err) {
                _this.error(err);
                return const_1.CANCELLED;
            }
        });
        return this;
    };
    return ExpressRouteHandlerStream;
}(stream_1.Stream));
exports.ExpressRouteHandlerStream = ExpressRouteHandlerStream;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc19zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXh0cmEvZXhwcmVzc19zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUNsQyxrQ0FBbUM7QUFDbkMsOEJBQW1DO0FBQ25DLG9DQUFpQztBQUdwQixRQUFBLDBCQUEwQixHQUFRLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDO0FBQ3BELFFBQUEsbUNBQW1DLEdBQVEsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztBQUNyRSxRQUFBLDBCQUEwQixHQUFRLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDO0FBRWpFO0lBQXNDLGlDQUFXO0lBQWpEO1FBQUEscUVBNkJDO1FBM0JhLFVBQUksR0FBb0IsT0FBTyxFQUFFLENBQUM7UUFDbEMsY0FBUSxHQUE0QyxFQUFFLENBQUM7O0lBMEJyRSxDQUFDO0lBeEJHLHNCQUFXLDhCQUFHO2FBQWQ7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDOzs7T0FBQTtJQUVNLDhCQUFNLEdBQWIsVUFBYyxLQUFLLEVBQUUsTUFBWTtRQUFaLHVCQUFBLEVBQUEsY0FBWTtRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLDhCQUFNLEdBQWIsVUFBYyxNQUFvQjtRQUFwQix1QkFBQSxFQUFBLFlBQW9CO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLENBQUUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxD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