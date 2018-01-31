"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimerResource = /** @class */ (function () {
    function TimerResource() {
    }
    TimerResource.prototype.clear = function () {
        clearTimeout(this.resource);
        return this;
    };
    TimerResource.prototype.close = function () {
        this.isClosed = true;
        return this.clear();
    };
    TimerResource.prototype.create = function (cb, seconds) {
        var _this = this;
        if (this.isClosed) {
            return this;
        }
        this.resource = setTimeout(function () {
            _this.resource = null;
            cb();
        }, seconds * 1000);
        return this;
    };
    return TimerResource;
}());
exports.TimerResource = TimerResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUtJO0lBRUEsQ0FBQztJQUVNLDZCQUFLLEdBQVo7UUFDSSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLDZCQUFLLEdBQVo7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUVyQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTSw4QkFBTSxHQUFiLFVBQWMsRUFBRSxFQUFFLE9BQU87UUFBekIsaUJBWUM7UUFYRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztZQUN2QixLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUVyQixFQUFFLEVBQUUsQ0FBQztRQUNULENBQUMsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFbkIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUwsb0JBQUM7QUFBRCxDQUFDLEFBbkNELElBbUNDO0FBbkNZLHNDQUFhIn0=