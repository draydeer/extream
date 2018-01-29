"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("./stream");
var Delegate = /** @class */ (function () {
    function Delegate(executor) {
        this._executor = executor;
    }
    // public all(...asyncs: (Promise<T>|StreamInterface<T>)[]): Promise<T[]> {
    //
    // }
    Delegate.prototype.emit = function (data) {
        stream_1.Stream.prototype.emit.call(this._executor, data);
        return this;
    };
    Delegate.prototype.race = function () {
        var asyncs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            asyncs[_i] = arguments[_i];
        }
        asyncs.push(this._executor.incoming);
        return stream_1.Stream.merge.apply(stream_1.Stream, asyncs).first();
    };
    return Delegate;
}());
exports.Delegate = Delegate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGVsZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxtQ0FBZ0M7QUFHaEM7SUFJSSxrQkFBWSxRQUFxQjtRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQsMkVBQTJFO0lBQzNFLEVBQUU7SUFDRixJQUFJO0lBRUcsdUJBQUksR0FBWCxVQUFZLElBQU87UUFDZixlQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVqRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSx1QkFBSSxHQUFYO1FBQVksZ0JBQTRDO2FBQTVDLFVBQTRDLEVBQTVDLHFCQUE0QyxFQUE1QyxJQUE0QztZQUE1QywyQkFBNEM7O1FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVyQyxNQUFNLENBQUMsZUFBTSxDQUFDLEtBQUssT0FBWixlQUFNLEVBQVUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFTCxlQUFDO0FBQUQsQ0FBQyxBQXhCRCxJQXdCQztBQXhCWSw0QkFBUSJ9