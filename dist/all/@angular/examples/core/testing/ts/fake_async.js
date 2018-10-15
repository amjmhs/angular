"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
// #docregion basic
describe('this test', function () {
    it('looks async but is synchronous', testing_1.fakeAsync(function () {
        var flag = false;
        setTimeout(function () { flag = true; }, 100);
        expect(flag).toBe(false);
        testing_1.tick(50);
        expect(flag).toBe(false);
        testing_1.tick(50);
        expect(flag).toBe(true);
    }));
});
// #enddocregion
// #docregion pending
describe('this test', function () {
    it('aborts a periodic timer', testing_1.fakeAsync(function () {
        // This timer is scheduled but doesn't need to complete for the
        // test to pass (maybe it's a timeout for some operation).
        // Leaving it will cause the test to fail...
        setInterval(function () { }, 100);
        // Unless we clean it up first.
        testing_1.discardPeriodicTasks();
    }));
});
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZV9hc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvdGVzdGluZy90cy9mYWtlX2FzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsaURBQTRFO0FBRzVFLG1CQUFtQjtBQUNuQixRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBTyxtQkFBUyxDQUFDO1FBQy9DLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNqQixVQUFVLENBQUMsY0FBUSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixjQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQztBQUNILGdCQUFnQjtBQUVoQixxQkFBcUI7QUFDckIsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUNwQixFQUFFLENBQUMseUJBQXlCLEVBQU8sbUJBQVMsQ0FBQztRQUN4QywrREFBK0Q7UUFDL0QsMERBQTBEO1FBQzFELDRDQUE0QztRQUM1QyxXQUFXLENBQUMsY0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFM0IsK0JBQStCO1FBQy9CLDhCQUFvQixFQUFFLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNULENBQUMsQ0FBQyxDQUFDO0FBQ0gsZ0JBQWdCIn0=