"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// The functions in this file verify that the assumptions we are making
// about state in an instruction are correct before implementing any logic.
// They are meant only to be called in dev mode as sanity checks.
function assertNumber(actual, msg) {
    if (typeof actual != 'number') {
        throwError(msg);
    }
}
exports.assertNumber = assertNumber;
function assertEqual(actual, expected, msg) {
    if (actual != expected) {
        throwError(msg);
    }
}
exports.assertEqual = assertEqual;
function assertNotEqual(actual, expected, msg) {
    if (actual == expected) {
        throwError(msg);
    }
}
exports.assertNotEqual = assertNotEqual;
function assertSame(actual, expected, msg) {
    if (actual !== expected) {
        throwError(msg);
    }
}
exports.assertSame = assertSame;
function assertLessThan(actual, expected, msg) {
    if (actual >= expected) {
        throwError(msg);
    }
}
exports.assertLessThan = assertLessThan;
function assertGreaterThan(actual, expected, msg) {
    if (actual <= expected) {
        throwError(msg);
    }
}
exports.assertGreaterThan = assertGreaterThan;
function assertNotDefined(actual, msg) {
    if (actual != null) {
        throwError(msg);
    }
}
exports.assertNotDefined = assertNotDefined;
function assertDefined(actual, msg) {
    if (actual == null) {
        throwError(msg);
    }
}
exports.assertDefined = assertDefined;
function assertComponentType(actual, msg) {
    if (msg === void 0) { msg = 'Type passed in is not ComponentType, it does not have \'ngComponentDef\' property.'; }
    if (!actual.ngComponentDef) {
        debugger;
        throwError(msg);
    }
}
exports.assertComponentType = assertComponentType;
function throwError(msg) {
    debugger; // Left intentionally for better debugger experience.
    throw new Error("ASSERTION ERROR: " + msg);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9hc3NlcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1RUFBdUU7QUFDdkUsMkVBQTJFO0FBQzNFLGlFQUFpRTtBQUVqRSxzQkFBNkIsTUFBVyxFQUFFLEdBQVc7SUFDbkQsSUFBSSxPQUFPLE1BQU0sSUFBSSxRQUFRLEVBQUU7UUFDN0IsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0gsQ0FBQztBQUpELG9DQUlDO0FBRUQscUJBQStCLE1BQVMsRUFBRSxRQUFXLEVBQUUsR0FBVztJQUNoRSxJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7UUFDdEIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0gsQ0FBQztBQUpELGtDQUlDO0FBRUQsd0JBQWtDLE1BQVMsRUFBRSxRQUFXLEVBQUUsR0FBVztJQUNuRSxJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7UUFDdEIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0gsQ0FBQztBQUpELHdDQUlDO0FBRUQsb0JBQThCLE1BQVMsRUFBRSxRQUFXLEVBQUUsR0FBVztJQUMvRCxJQUFJLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDdkIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0gsQ0FBQztBQUpELGdDQUlDO0FBRUQsd0JBQWtDLE1BQVMsRUFBRSxRQUFXLEVBQUUsR0FBVztJQUNuRSxJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7UUFDdEIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0gsQ0FBQztBQUpELHdDQUlDO0FBRUQsMkJBQXFDLE1BQVMsRUFBRSxRQUFXLEVBQUUsR0FBVztJQUN0RSxJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7UUFDdEIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0gsQ0FBQztBQUpELDhDQUlDO0FBRUQsMEJBQW9DLE1BQVMsRUFBRSxHQUFXO0lBQ3hELElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtRQUNsQixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakI7QUFDSCxDQUFDO0FBSkQsNENBSUM7QUFFRCx1QkFBaUMsTUFBUyxFQUFFLEdBQVc7SUFDckQsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQjtBQUNILENBQUM7QUFKRCxzQ0FJQztBQUVELDZCQUNJLE1BQVcsRUFDWCxHQUN3RjtJQUR4RixvQkFBQSxFQUFBLDBGQUN3RjtJQUMxRixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRTtRQUMxQixRQUFRLENBQUM7UUFDVCxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakI7QUFDSCxDQUFDO0FBUkQsa0RBUUM7QUFFRCxvQkFBb0IsR0FBVztJQUM3QixRQUFRLENBQUMsQ0FBRSxxREFBcUQ7SUFDaEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBb0IsR0FBSyxDQUFDLENBQUM7QUFDN0MsQ0FBQyJ9