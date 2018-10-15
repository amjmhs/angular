"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ng_dev_mode_1 = require("../../src/render3/ng_dev_mode");
beforeEach(ng_dev_mode_1.ngDevModeResetPerfCounters);
beforeEach(function () {
    jasmine.addMatchers({
        toHaveProperties: function (util, customEqualityTesters) {
            return { compare: toHavePropertiesCompare };
        }
    });
});
function toHavePropertiesCompare(actual, expected) {
    var pass = true;
    var errors = [];
    for (var _i = 0, _a = Object.keys(actual); _i < _a.length; _i++) {
        var key = _a[_i];
        if (expected.hasOwnProperty(key)) {
            if (actual[key] !== expected[key]) {
                pass = false;
                errors.push("Expected '" + key + "' to be '" + expected[key] + "' but was '" + actual[key] + "'.");
            }
        }
    }
    return { pass: pass, message: errors.join('\n') };
}
describe('toHaveProperties', function () {
    it('should pass', function () {
        expect({ tNode: 1 }).toHaveProperties({});
        expect({ tNode: 2 }).toHaveProperties({ tNode: 2 });
    });
    it('should fail', function () {
        expect(toHavePropertiesCompare({ tNode: 2, tView: 4 }, { tNode: 3, tView: 5 })).toEqual({
            pass: false,
            message: 'Expected \'tNode\' to be \'3\' but was \'2\'.\nExpected \'tView\' to be \'5\' but was \'4\'.'
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZkNvdW50ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL3BlcmZDb3VudGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw2REFBeUU7QUFFekUsVUFBVSxDQUFDLHdDQUEwQixDQUFDLENBQUM7QUFDdkMsVUFBVSxDQUFDO0lBQ1QsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUNsQixnQkFBZ0IsRUFBRSxVQUFTLElBQUksRUFBRSxxQkFBcUI7WUFDcEQsT0FBTyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBQyxDQUFDO1FBQzVDLENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUNILGlDQUFpQyxNQUFXLEVBQUUsUUFBYTtJQUN6RCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQWdCLFVBQW1CLEVBQW5CLEtBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUIsRUFBRTtRQUFoQyxJQUFJLEdBQUcsU0FBQTtRQUNWLElBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFhLEdBQUcsaUJBQVksUUFBUSxDQUFDLEdBQUcsQ0FBQyxtQkFBYyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQUksQ0FBQyxDQUFDO2FBQ3JGO1NBQ0Y7S0FDRjtJQUNELE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUMzQixFQUFFLENBQUMsYUFBYSxFQUFFO1FBQ2hCLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsYUFBYSxFQUFFO1FBQ2hCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNsRixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFDSCw4RkFBOEY7U0FDbkcsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9