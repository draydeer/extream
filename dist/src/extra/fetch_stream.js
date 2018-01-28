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
    // middlewares
    FetchResponseStream.prototype.extractBlob = function () {
        return this._middlewareAdd(function (data, stream) { return data.blob(); });
    };
    FetchResponseStream.prototype.extractFormData = function () {
        return this._middlewareAdd(function (data, stream) { return data.formData(); });
    };
    FetchResponseStream.prototype.extractJson = function () {
        return this._middlewareAdd(function (data, stream) { return data.json(); });
    };
    FetchResponseStream.prototype.extractText = function () {
        return this._middlewareAdd(function (data, stream) { return data.text(); });
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
    Object.defineProperty(FetchStream.prototype, "clone", {
        get: function () {
            return new FetchResponseStream();
        },
        enumerable: true,
        configurable: true
    });
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
