"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TraceEventFactory = /** @class */ (function () {
    function TraceEventFactory(_cat, _pid) {
        this._cat = _cat;
        this._pid = _pid;
    }
    TraceEventFactory.prototype.create = function (ph, name, time, args) {
        if (args === void 0) { args = null; }
        var res = { 'name': name, 'cat': this._cat, 'ph': ph, 'ts': time, 'pid': this._pid };
        if (args != null) {
            res['args'] = args;
        }
        return res;
    };
    TraceEventFactory.prototype.markStart = function (name, time) { return this.create('B', name, time); };
    TraceEventFactory.prototype.markEnd = function (name, time) { return this.create('E', name, time); };
    TraceEventFactory.prototype.start = function (name, time, args) {
        if (args === void 0) { args = null; }
        return this.create('B', name, time, args);
    };
    TraceEventFactory.prototype.end = function (name, time, args) {
        if (args === void 0) { args = null; }
        return this.create('E', name, time, args);
    };
    TraceEventFactory.prototype.instant = function (name, time, args) {
        if (args === void 0) { args = null; }
        return this.create('I', name, time, args);
    };
    TraceEventFactory.prototype.complete = function (name, time, duration, args) {
        if (args === void 0) { args = null; }
        var res = this.create('X', name, time, args);
        res['dur'] = duration;
        return res;
    };
    return TraceEventFactory;
}());
exports.TraceEventFactory = TraceEventFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2VfZXZlbnRfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC90cmFjZV9ldmVudF9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUg7SUFDRSwyQkFBb0IsSUFBWSxFQUFVLElBQVk7UUFBbEMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFNBQUksR0FBSixJQUFJLENBQVE7SUFBRyxDQUFDO0lBRTFELGtDQUFNLEdBQU4sVUFBTyxFQUFPLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxJQUFnQjtRQUFoQixxQkFBQSxFQUFBLFdBQWdCO1FBQzFELElBQU0sR0FBRyxHQUNVLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQztRQUM1RixJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztTQUNwQjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELHFDQUFTLEdBQVQsVUFBVSxJQUFZLEVBQUUsSUFBWSxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU5RSxtQ0FBTyxHQUFQLFVBQVEsSUFBWSxFQUFFLElBQVksSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUUsaUNBQUssR0FBTCxVQUFNLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBZ0I7UUFBaEIscUJBQUEsRUFBQSxXQUFnQjtRQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUFDLENBQUM7SUFFbEcsK0JBQUcsR0FBSCxVQUFJLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBZ0I7UUFBaEIscUJBQUEsRUFBQSxXQUFnQjtRQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUFDLENBQUM7SUFFaEcsbUNBQU8sR0FBUCxVQUFRLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBZ0I7UUFBaEIscUJBQUEsRUFBQSxXQUFnQjtRQUNsRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELG9DQUFRLEdBQVIsVUFBUyxJQUFZLEVBQUUsSUFBWSxFQUFFLFFBQWdCLEVBQUUsSUFBZ0I7UUFBaEIscUJBQUEsRUFBQSxXQUFnQjtRQUNyRSxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDdEIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBN0JZLDhDQUFpQiJ9