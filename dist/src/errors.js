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
var Cancelled = /** @class */ (function (_super) {
    __extends(Cancelled, _super);
    function Cancelled() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Cancelled;
}(Error));
exports.Cancelled = Cancelled;
var Completed = /** @class */ (function (_super) {
    __extends(Completed, _super);
    function Completed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Completed;
}(Error));
exports.Completed = Completed;
