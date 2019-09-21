"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function make(data, type, region) {
    return { data: data, region: region, type: type };
}
exports.make = make;
function makeBy(msg, data, type, region) {
    var copy = __assign({}, msg);
    if (data) {
        copy.data = data;
    }
    if (region) {
        copy.region = region;
    }
    if (type) {
        copy.type = type;
    }
    return copy;
}
exports.makeBy = makeBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXNnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21zZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsY0FBNEIsSUFBUSxFQUFFLElBQVUsRUFBRSxNQUFZO0lBQzFELE1BQU0sQ0FBQyxFQUFDLElBQUksTUFBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUM7QUFDaEMsQ0FBQztBQUZELG9CQUVDO0FBRUQsZ0JBQThCLEdBQVEsRUFBRSxJQUFRLEVBQUUsSUFBVSxFQUFFLE1BQVk7SUFDdEUsSUFBTSxJQUFJLGdCQUFPLEdBQUcsQ0FBQyxDQUFDO0lBRXRCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDUCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNULElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1AsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQWhCRCx3QkFnQkMifQ==