"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
// #docregion basic
describe('this test', () => {
    it('looks async but is synchronous', testing_1.fakeAsync(() => {
        let flag = false;
        setTimeout(() => { flag = true; }, 100);
        expect(flag).toBe(false);
        testing_1.tick(50);
        expect(flag).toBe(false);
        testing_1.tick(50);
        expect(flag).toBe(true);
    }));
});
// #enddocregion
// #docregion pending
describe('this test', () => {
    it('aborts a periodic timer', testing_1.fakeAsync(() => {
        // This timer is scheduled but doesn't need to complete for the
        // test to pass (maybe it's a timeout for some operation).
        // Leaving it will cause the test to fail...
        setInterval(() => { }, 100);
        // Unless we clean it up first.
        testing_1.discardPeriodicTasks();
    }));
});
// #enddocregion
//# sourceMappingURL=fake_async.js.map