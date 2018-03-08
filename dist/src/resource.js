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
    TimerResource.prototype.open = function (cb, seconds) {
        var _this = this;
        if (this.isClosed || this.resource) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUtJO0lBRUEsQ0FBQztJQUVNLDZCQUFLLEdBQVo7UUFDSSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLDZCQUFLLEdBQVo7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUVyQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTSw0QkFBSSxHQUFYLFVBQVksRUFBRSxFQUFFLE9BQU87UUFBdkIsaUJBWUM7UUFYRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBRXJCLEVBQUUsRUFBRSxDQUFDO1FBQ1QsQ0FBQyxFQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVuQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTCxvQkFBQztBQUFELENBQUMsQUFuQ0QsSUFtQ0M7QUFuQ1ksc0NBQWEifQ==