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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdWJzY3JpYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDO0FBRWxCOztHQUVHO0FBQ0g7SUFTSSxvQkFBWSxNQUEwQixFQUFFLE1BQWtCLEVBQUUsT0FBb0IsRUFBRSxVQUEwQjtRQUN4RyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFRCxzQkFBVywwQkFBRTthQUFiO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxnQ0FBUTthQUFuQjtZQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw4QkFBTTthQUFqQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLENBQUM7OztPQUFBO0lBRU0sNkJBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFbkMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0seUJBQUksR0FBWCxVQUFZLElBQU87UUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVyQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hC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