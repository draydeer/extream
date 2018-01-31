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
var stream_1 = require("../stream");
var ExpressjsStream = /** @class */ (function (_super) {
    __extends(ExpressjsStream, _super);
    function ExpressjsStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ExpressjsStream;
}(stream_1.Stream));
exports.ExpressjsStream = ExpressjsStream;
var ExpressjsRequestStream = /** @class */ (function (_super) {
    __extends(ExpressjsRequestStream, _super);
    function ExpressjsRequestStream() {
        return _super.call(this) || this;
    }
    ExpressjsRequestStream.prototype.end = function () {
        return this;
    };
    return ExpressjsRequestStream;
}(stream_1.Stream));
exports.ExpressjsRequestStream = ExpressjsRequestStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2pzX3N0cmVhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHRyYS9leHByZXNzanNfc3RyZWFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLG9DQUFpQztBQUVqQztJQUF3QyxtQ0FBUztJQUFqRDs7SUFFQSxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBd0MsZUFBTSxHQUU3QztBQUZZLDBDQUFlO0FBSTVCO0lBQStDLDBDQUFTO0lBRXBEO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBRU0sb0NBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVMLDZCQUFDO0FBQUQsQ0FBQyxBQVZELENBQStDLGVBQU0sR0FVcEQ7QUFWWSx3REFBc0IifQ==