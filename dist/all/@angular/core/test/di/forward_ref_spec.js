"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var di_1 = require("@angular/core/src/di");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
{
    testing_internal_1.describe('forwardRef', function () {
        testing_internal_1.it('should wrap and unwrap the reference', function () {
            var ref = di_1.forwardRef(function () { return String; });
            testing_internal_1.expect(ref instanceof core_1.Type).toBe(true);
            testing_internal_1.expect(di_1.resolveForwardRef(ref)).toBe(String);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yd2FyZF9yZWZfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9kaS9mb3J3YXJkX3JlZl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQW1DO0FBQ25DLDJDQUFtRTtBQUNuRSwrRUFBZ0Y7QUFFaEY7SUFDRSwyQkFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixxQkFBRSxDQUFDLHNDQUFzQyxFQUFFO1lBQ3pDLElBQU0sR0FBRyxHQUFHLGVBQVUsQ0FBQyxjQUFNLE9BQUEsTUFBTSxFQUFOLENBQU0sQ0FBQyxDQUFDO1lBQ3JDLHlCQUFNLENBQUMsR0FBRyxZQUFZLFdBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2Qyx5QkFBTSxDQUFDLHNCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9