"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("./stream");
var Agent = /** @class */ (function () {
    function Agent(executor) {
        this._executor = executor;
    }
    // public all(...asyncs: (Promise<T>|StreamInterface<T>)[]): Promise<T[]> {
    //
    // }
    Agent.prototype.emit = function (data) {
        stream_1.Stream.prototype.emit.call(this._executor, data);
        return this;
    };
    Agent.prototype.race = function () {
        var asyncs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            asyncs[_i] = arguments[_i];
        }
        asyncs.push(this._executor.incoming);
        return stream_1.Stream.merge.apply(stream_1.Stream, asyncs).first().toPromise();
    };
    return Agent;
}());
exports.Agent = Agent;
