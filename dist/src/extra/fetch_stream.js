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
var fetch = require("node-fetch");
var stream_1 = require("../stream");
var FetchResponseStream = /** @class */ (function (_super) {
    __extends(FetchResponseStream, _super);
    function FetchResponseStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FetchResponseStream.prototype, "compatible", {
        get: function () {
            return new FetchResponseStream();
        },
        enumerable: true,
        configurable: true
    });
    // middlewares
    FetchResponseStream.prototype.extractBlob = function () {
        return this._middlewareAdd(function (data, stream) { return data.blob(); }).await();
    };
    FetchResponseStream.prototype.extractFormData = function () {
        return this._middlewareAdd(function (data, stream) { return data.formData(); }).await();
    };
    FetchResponseStream.prototype.extractJson = function () {
        return this._middlewareAdd(function (data, stream) { return data.json(); }).await();
    };
    FetchResponseStream.prototype.extractText = function () {
        return this._middlewareAdd(function (data, stream) { return data.text(); }).await();
    };
    return FetchResponseStream;
}(stream_1.Stream));
exports.FetchResponseStream = FetchResponseStream;
var FetchStream = /** @class */ (function (_super) {
    __extends(FetchStream, _super);
    function FetchStream(_url, _options) {
        var _this = _super.call(this) || this;
        _this._url = _url;
        _this._options = _options;
        return _this;
    }
    FetchStream.delete = function (url, _options) {
        return new FetchStream(url).delete(_options);
    };
    FetchStream.get = function (url, _options) {
        return new FetchStream(url).get(_options);
    };
    FetchStream.options = function (url, _options) {
        return new FetchStream(url).options(_options);
    };
    FetchStream.patch = function (url, data, _options) {
        return new FetchStream(url).patch(data, _options);
    };
    FetchStream.post = function (url, data, _options) {
        return new FetchStream(url).post(data, _options);
    };
    FetchStream.put = function (url, data, _options) {
        return new FetchStream(url).put(data, _options);
    };
    FetchStream.prototype.emit = function (options, subscribers) {
        options = Object.assign({}, this._options, options);
        if (options.method === void 0) {
            options.method = 'GET';
        }
        this._request(this._url, options, subscribers);
        return this;
    };
    FetchStream.prototype.delete = function (options) {
        return this.emit(options ? Object.assign(options, { method: 'DELETE' }) : { method: 'DELETE' });
    };
    FetchStream.prototype.get = function (options) {
        return this.emit(options ? Object.assign(options, { method: 'GET' }) : { method: 'GET' });
    };
    FetchStream.prototype.options = function (options) {
        return this.emit(options ? Object.assign(options, { method: 'OPTIONS' }) : { method: 'OPTIONS' });
    };
    FetchStream.prototype.patch = function (body, options) {
        return this.emit(options ? Object.assign(options, { body: body, method: 'PATCH' }) : { body: body, method: 'PATCH' });
    };
    FetchStream.prototype.post = function (body, options) {
        return this.emit(options ? Object.assign(options, { body: body, method: 'POST' }) : { body: body, method: 'POST' });
    };
    FetchStream.prototype.put = function (body, options) {
        return this.emit(options ? Object.assign(options, { body: body, method: 'PUT' }) : { body: body, method: 'PUT' });
    };
    FetchStream.prototype._request = function (url, options, subscribers) {
        var _this = this;
        return fetch(url, Object.assign(options || {}, this._options)).then(function (response) {
            _super.prototype.emit.call(_this, response, subscribers);
        }).catch(function (error) {
            _this.error(error);
        });
    };
    return FetchStream;
}(FetchResponseStream));
exports.FetchStream = FetchStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hfc3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V4dHJhL2ZldGNoX3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrQ0FBb0M7QUFFcEMsb0NBQWlDO0FBVWpDO0lBQTRDLHVDQUFTO0lBQXJEOztJQXdCQSxDQUFDO0lBdEJHLHNCQUFXLDJDQUFVO2FBQXJCO1lBQ0ksTUFBTSxDQUFDLElBQUksbUJBQW1CLEVBQWEsQ0FBQztRQUNoRCxDQUFDOzs7T0FBQTtJQUVELGNBQWM7SUFFUCx5Q0FBVyxHQUFsQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsSUFBUyxFQUFFLE1BQU0sSUFBSyxPQUFBLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzRSxDQUFDO0lBRU0sNkNBQWUsR0FBdEI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFDLElBQVMsRUFBRSxNQUFNLElBQUssT0FBQSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQWYsQ0FBZSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDL0UsQ0FBQztJQUVNLHlDQUFXLEdBQWxCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFTLEVBQUUsTUFBTSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFYLENBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNFLENBQUM7SUFFTSx5Q0FBVyxHQUFsQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsSUFBUyxFQUFFLE1BQU0sSUFBSyxPQUFBLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzRSxDQUFDO0lBRUwsMEJBQUM7QUFBRCxDQUFD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