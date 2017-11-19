"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this._isResolved = false;
        this._isRejected = false;
        this._promise = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
    }
    Object.defineProperty(Deferred.prototype, "isCompleted", {
        get: function () {
            return this._isRejected || this._isResolved;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Deferred.prototype, "isResolved", {
        get: function () {
            return this._isResolved;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Deferred.prototype, "isRejected", {
        get: function () {
            return this._isRejected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Deferred.prototype, "promise", {
        get: function () {
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    Deferred.prototype.resolve = function (data) {
        if (false === this.isCompleted) {
            this._resolve(data);
            this._isResolved = true;
        }
        return this;
    };
    Deferred.prototype.reject = function (error) {
        if (false === this.isCompleted) {
            this._reject(error);
            this._isRejected = true;
        }
        return this;
    };
    return Deferred;
}());
exports.Deferred = Deferred;
