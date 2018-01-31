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
    Subscriber.prototype.doComplete = function (subscribers) {
        this._processMiddleware();
        if (this._onComplete) {
            this._onComplete(subscribers);
        }
        return this.unsubscribe();
    };
    Subscriber.prototype.doData = function (data, subscribers) {
        data = this._processMiddleware(data);
        if (this._onData) {
            this._onData(data, subscribers);
        }
        return this;
    };
    Subscriber.prototype.doError = function (error, subscribers) {
        this._processMiddleware(error);
        if (this._onError) {
            this._onError(error, subscribers);
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
        this.doComplete = onComplete;
        this.doData = onData;
        this.doError = onError;
        this._id = String(ID++);
        this._stream = stream;
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
            return true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdWJzY3JpYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDO0FBRWxCOztHQUVHO0FBQ0g7SUFVSSxvQkFBWSxNQUEwQixFQUFFLE1BQWtCLEVBQUUsT0FBb0IsRUFBRSxVQUEwQjtRQUN4RyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFRCxzQkFBVywwQkFBRTthQUFiO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxrQ0FBVTthQUFyQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQztRQUNyQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDhCQUFNO2FBQWpCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFTSw2QkFBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFFeEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sZ0NBQVcsR0FBbEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFFNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFH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