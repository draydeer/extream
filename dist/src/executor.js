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
var delegate_1 = require("./delegate");
var const_1 = require("./const");
var stream_1 = require("./stream");
var Executor = /** @class */ (function (_super) {
    __extends(Executor, _super);
    function Executor(async) {
        var _this = _super.call(this) || this;
        _this._incomingStream = new stream_1.Stream().progressive();
        _this._async = async;
        _this._delegate = new delegate_1.Delegate(_this);
        return _this;
    }
    Object.defineProperty(Executor.prototype, "incoming", {
        get: function () {
            return this._incomingStream;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "isRunning", {
        get: function () {
            return !!this._promise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Executor.prototype, "promise", {
        get: function () {
            if (this._promise) {
                return this._promise;
            }
            this.run();
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    Executor.prototype.complete = function () {
        this._incomingStream.error(const_1.Completed);
        return _super.prototype.complete.call(this);
    };
    Executor.prototype.emit = function (data) {
        this._incomingStream.emit(data);
        return this;
    };
    Executor.prototype.error = function (error) {
        this._incomingStream.error(error);
        return this;
    };
    Executor.prototype.pipeOutgoingTo = function () {
        var _this = this;
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        streams.forEach(function (stream) { return _this.subscribeStream(stream); });
        return this;
    };
    Executor.prototype.pipeToIncoming = function () {
        var _this = this;
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        streams.forEach(function (stream) { return stream.subscribeStream(_this._incomingStream); });
        return this;
    };
    Executor.prototype.run = function () {
        var _this = this;
        if (this._promise) {
            return this;
        }
        this._promise = this._async(this._delegate).then(function (result) {
            _this._promise = void 0;
            _this._result = result;
            _super.prototype.emit.call(_this, result);
            return result;
        }).catch(function (error) {
            _this._promise = void 0;
            _this._error = error;
            _super.prototype.error.call(_this, error);
            throw error;
        });
        return this;
    };
    // promise like
    Executor.prototype.catch = function (onrejected) {
        return this.promise.catch(onrejected);
    };
    Executor.prototype.then = function (onfulfilled) {
        return this.promise.then(onfulfilled);
    };
    return Executor;
}(stream_1.Stream));
exports.Executor = Executor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXhlY3V0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQW9DO0FBQ3BDLGlDQUE2QztBQUM3QyxtQ0FBZ0M7QUFLaEM7SUFBaUMsNEJBQVM7SUFTdEMsa0JBQVksS0FBNEM7UUFBeEQsWUFDSSxpQkFBTyxTQUlWO1FBVFMscUJBQWUsR0FBdUIsSUFBSSxlQUFNLEVBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQU8xRSxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixLQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsQ0FBSSxLQUFJLENBQUMsQ0FBQzs7SUFDM0MsQ0FBQztJQUVELHNCQUFXLDhCQUFRO2FBQW5CO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDaEMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVywrQkFBUzthQUFwQjtZQUNJLE1BQU0sQ0FBQyxDQUFDLENBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM1QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDRCQUFNO2FBQWpCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw2QkFBTzthQUFsQjtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN6QixDQUFDO1lBRUQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRVgsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQzs7O09BQUE7SUFFTSwyQkFBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsaUJBQVMsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxp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