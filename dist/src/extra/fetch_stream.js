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
    FetchStream.prototype.emit = function (options) {
        options = Object.assign({}, this._options, options);
        if (options.method === void 0) {
            options.method = 'GET';
        }
        this._request(this._url, Object.assign({}, this._options, options));
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
    // middlewares
    FetchStream.prototype.extractBlob = function () {
        return this._middlewareAdd(function (data, stream) { return data.blob(); });
    };
    FetchStream.prototype.extractFormData = function () {
        return this._middlewareAdd(function (data, stream) { return data.formData(); });
    };
    FetchStream.prototype.extractJson = function () {
        return this._middlewareAdd(function (data, stream) { return data.json(); });
    };
    FetchStream.prototype.extractText = function () {
        return this._middlewareAdd(function (data, stream) { return data.text(); });
    };
    FetchStream.prototype._request = function (url, options) {
        var _this = this;
        if (!options) {
            options = Object.assign({}, this._options);
        }
        else {
            options = Object.assign({}, this._options, options);
        }
        return fetch(url, options).then(function (response) {
            _super.prototype.emit.call(_this, response);
        }).catch(function (error) {
            _this.error(error);
        });
    };
    return FetchStream;
}(stream_1.Stream));
exports.FetchStream = FetchStream;
