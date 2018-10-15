"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var change_detection_util_1 = require("@angular/core/src/change_detection/change_detection_util");
{
    describe('ChangeDetectionUtil', function () {
        describe('devModeEqual', function () {
            it('should do the deep comparison of iterables', function () {
                expect(change_detection_util_1.devModeEqual([['one']], [['one']])).toBe(true);
                expect(change_detection_util_1.devModeEqual(['one'], ['one', 'two'])).toBe(false);
                expect(change_detection_util_1.devModeEqual(['one', 'two'], ['one'])).toBe(false);
                expect(change_detection_util_1.devModeEqual(['one'], 'one')).toBe(false);
                expect(change_detection_util_1.devModeEqual(['one'], new Object())).toBe(false);
                expect(change_detection_util_1.devModeEqual('one', ['one'])).toBe(false);
                expect(change_detection_util_1.devModeEqual(new Object(), ['one'])).toBe(false);
            });
            it('should compare primitive numbers', function () {
                expect(change_detection_util_1.devModeEqual(1, 1)).toBe(true);
                expect(change_detection_util_1.devModeEqual(1, 2)).toBe(false);
                expect(change_detection_util_1.devModeEqual(new Object(), 2)).toBe(false);
                expect(change_detection_util_1.devModeEqual(1, new Object())).toBe(false);
            });
            it('should compare primitive strings', function () {
                expect(change_detection_util_1.devModeEqual('one', 'one')).toBe(true);
                expect(change_detection_util_1.devModeEqual('one', 'two')).toBe(false);
                expect(change_detection_util_1.devModeEqual(new Object(), 'one')).toBe(false);
                expect(change_detection_util_1.devModeEqual('one', new Object())).toBe(false);
            });
            it('should compare primitive booleans', function () {
                expect(change_detection_util_1.devModeEqual(true, true)).toBe(true);
                expect(change_detection_util_1.devModeEqual(true, false)).toBe(false);
                expect(change_detection_util_1.devModeEqual(new Object(), true)).toBe(false);
                expect(change_detection_util_1.devModeEqual(true, new Object())).toBe(false);
            });
            it('should compare null', function () {
                expect(change_detection_util_1.devModeEqual(null, null)).toBe(true);
                expect(change_detection_util_1.devModeEqual(null, 1)).toBe(false);
                expect(change_detection_util_1.devModeEqual(new Object(), null)).toBe(false);
                expect(change_detection_util_1.devModeEqual(null, new Object())).toBe(false);
            });
            it('should return true for other objects', function () { expect(change_detection_util_1.devModeEqual(new Object(), new Object())).toBe(true); });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdG9yX3V0aWxfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rvcl91dGlsX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrR0FBc0Y7QUFFdEY7SUFDRSxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUN2QixFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9DLE1BQU0sQ0FBQyxvQ0FBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RELE1BQU0sQ0FBQyxvQ0FBWSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDLG9DQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsb0NBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsb0NBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxDQUFDLG9DQUFZLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLG9DQUFZLENBQUMsSUFBSSxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUU7Z0JBQ3JDLE1BQU0sQ0FBQyxvQ0FBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLG9DQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLENBQUMsb0NBQVksQ0FBQyxJQUFJLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLENBQUMsb0NBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO2dCQUNyQyxNQUFNLENBQUMsb0NBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxvQ0FBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxDQUFDLG9DQUFZLENBQUMsSUFBSSxNQUFNLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEQsTUFBTSxDQUFDLG9DQUFZLENBQUMsS0FBSyxFQUFFLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtnQkFDdEMsTUFBTSxDQUFDLG9DQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsb0NBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxvQ0FBWSxDQUFDLElBQUksTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JELE1BQU0sQ0FBQyxvQ0FBWSxDQUFDLElBQUksRUFBRSxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUU7Z0JBQ3hCLE1BQU0sQ0FBQyxvQ0FBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLG9DQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLENBQUMsb0NBQVksQ0FBQyxJQUFJLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyRCxNQUFNLENBQUMsb0NBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUN0QyxjQUFRLE1BQU0sQ0FBQyxvQ0FBWSxDQUFDLElBQUksTUFBTSxFQUFFLEVBQUUsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=