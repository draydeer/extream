"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ID = 10000000;
/**
 * Subscriber.
 */
var Subscriber = /** @class */ (function () {
    function Subscriber(stream, onData, onError, onComplete) {
        this._id = String(ID += 1);
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
    Object.defineProperty(Subscriber.prototype, "isShared", {
        get: function () {
            return false;
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
    Subscriber.prototype.complete = function () {
        this._stream.root.complete([this]);
        return this;
    };
    Subscriber.prototype.emit = function (data) {
        this._stream.root.emit(data, [this]);
        return this;
    };
    Subscriber.prototype.error = function (error) {
        this._stream.root.error(error, [this]);
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
        this._onComplete = onComplete;
        this._onData = onData;
        this._onError = onError;
        this._id = String(ID += 1);
        this._stream = stream;
    }
    Object.defineProperty(UnsafeSubscriber.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnsafeSubscriber.prototype, "isShared", {
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
    Object.defineProperty(UnsafeSubscriber.prototype, "tag", {
        get: function () {
            return this._tag;
        },
        enumerable: true,
        configurable: true
    });
    UnsafeSubscriber.prototype.setTag = function (tag) {
        this._tag = tag;
        return this;
    };
    UnsafeSubscriber.prototype.complete = function () {
        this._stream.root.complete([this]);
        return this;
    };
    UnsafeSubscriber.prototype.emit = function (data) {
        this._stream.root.emit(data, [this]);
        return this;
    };
    UnsafeSubscriber.prototype.error = function (error) {
        this._stream.root.error(error, [this]);
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
    UnsafeSubscriber.prototype.doComplete = function (subscribers) {
        this._onComplete(subscribers);
        return this.unsubscribe();
    };
    UnsafeSubscriber.prototype.doData = function (data, subscribers) {
        this._onData(data, subscribers);
        return this;
    };
    UnsafeSubscriber.prototype.doError = function (error, subscribers) {
        this._onError(error, subscribers);
        return this;
    };
    return UnsafeSubscriber;
}());
exports.UnsafeSubscriber = UnsafeSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdWJzY3JpYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDO0FBRWxCOztHQUVHO0FBQ0g7SUFTSSxvQkFBWSxNQUEwQixFQUFFLE1BQWtCLEVBQUUsT0FBb0IsRUFBRSxVQUEwQjtRQUN4RyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVELHNCQUFXLDBCQUFFO2FBQWI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGdDQUFRO2FBQW5CO1lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDhCQUFNO2FBQWpCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFTSw2QkFBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVuQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSx5QkFBSSxHQUFYLFVBQVksSUFBTztRQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXJDLE1BQU0sQ0FBQyxJQUFJLENBQUM7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