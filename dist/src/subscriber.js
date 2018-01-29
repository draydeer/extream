"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ID = 10000000;
/**
 * Subscriber.
 */
var Subscriber = /** @class */ (function () {
    function Subscriber(stream, onData, onError, onComplete) {
        this._id = String(ID++);
        this._onComplete = onComplete;
        this._onError = onError;
        this._onData = onData;
        this._stream = stream;
    }
    Object.defineProperty(Subscriber.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscriber.prototype, "isIsolated", {
        get: function () {
            return this._isIsolated === true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscriber.prototype, "stream", {
        get: function () {
            return this._stream;
        },
        enumerable: true,
        configurable: true
    });
    Subscriber.prototype.isolated = function () {
        this._isIsolated = true;
        return this;
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this._stream) {
            var stream = this._stream;
            this._middleware = this._stream = null;
            stream.unsubscribe(this);
        }
        return this;
    };
    // middlewares
    Subscriber.prototype.once = function () {
        this._middleware = this.unsubscribe.bind(this);
        return this;
    };
    // handlers
    Subscriber.prototype.doComplete = function () {
        this._processMiddleware();
        if (this._onComplete) {
            this._onComplete();
        }
        return this.unsubscribe();
    };
    Subscriber.prototype.doData = function (data) {
        data = this._processMiddleware(data);
        if (this._onData) {
            this._onData(data);
        }
        return this;
    };
    Subscriber.prototype.doError = function (error) {
        this._processMiddleware(error);
        if (this._onError) {
            this._onError(error);
        }
        return this;
    };
    Subscriber.prototype._processMiddleware = function (data) {
        if (this._middleware) {
            this._middleware();
        }
        return data;
    };
    return Subscriber;
}());
exports.Subscriber = Subscriber;
/**
 * Subscriber.
 */
var UnsafeSubscriber = /** @class */ (function () {
    function UnsafeSubscriber(stream, onData, onError, onComplete) {
        this._id = String(ID++);
        this._stream = stream;
        this.doComplete = onComplete;
        this.doError = onError;
        this.doData = onData;
    }
    Object.defineProperty(UnsafeSubscriber.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnsafeSubscriber.prototype, "isIsolated", {
        get: function () {
            return this._isIsolated === true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnsafeSubscriber.prototype, "stream", {
        get: function () {
            return this._stream;
        },
        enumerable: true,
        configurable: true
    });
    UnsafeSubscriber.prototype.isolated = function () {
        this._isIsolated = true;
        return this;
    };
    UnsafeSubscriber.prototype.unsubscribe = function () {
        if (this._stream) {
            var stream = this._stream;
            this._middleware = this._stream = null;
            stream.unsubscribe(this);
        }
        return this;
    };
    UnsafeSubscriber.prototype.once = function () {
        return this;
    };
    return UnsafeSubscriber;
}());
exports.UnsafeSubscriber = UnsafeSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdWJzY3JpYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDO0FBRWxCOztHQUVHO0FBQ0g7SUFzQkksb0JBQVksTUFBMEIsRUFBRSxNQUFrQixFQUFFLE9BQWlCLEVBQUUsVUFBdUI7UUFDbEcsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsRUFBRSxFQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBbEJELHNCQUFXLDBCQUFFO2FBQWI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGtDQUFVO2FBQXJCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDO1FBQ3JDLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsOEJBQU07YUFBakI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQVVNLDZCQUFRLEdBQWY7UUFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUV4QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxnQ0FBVyxHQUFsQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUU1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLEdB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