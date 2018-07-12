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
    FetchResponseStream.prototype.getCompatible = function () {
        return new FetchResponseStream();
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hfc3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V4dHJhL2ZldGNoX3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrQ0FBb0M7QUFFcEMsb0NBQWlDO0FBVWpDO0lBQTRDLHVDQUFTO0lBQXJEOztJQXdCQSxDQUFDO0lBdEJVLDJDQUFhLEdBQXBCO1FBQ0ksTUFBTSxDQUFDLElBQUksbUJBQW1CLEVBQWEsQ0FBQztJQUNoRCxDQUFDO0lBRUQsY0FBYztJQUVQLHlDQUFXLEdBQWxCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFTLEVBQUUsTUFBTSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFYLENBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNFLENBQUM7SUFFTSw2Q0FBZSxHQUF0QjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsSUFBUyxFQUFFLE1BQU0sSUFBSyxPQUFBLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBZixDQUFlLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvRSxDQUFDO0lBRU0seUNBQVcsR0FBbEI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFDLElBQVMsRUFBRSxNQUFNLElBQUssT0FBQSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQVgsQ0FBVyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDM0UsQ0FBQztJQUVNLHlDQUFXLEdBQWxCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxJQUFTLEVBQUUsTUFBTSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFYLENBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNFLENBQUM7SUFFTCwwQkFBQztBQUFELENBQUMsQUF4QkQsQ0FBNEMs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