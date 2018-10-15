"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Public Test Library for unit testing Angular applications. Assumes that you are running
 * with Jasmine, Mocha, or a similar framework which exports a beforeEach function and
 * allows tests to be asynchronous by either returning a promise or using a 'done' parameter.
 */
var fake_async_1 = require("./fake_async");
var test_bed_1 = require("./test_bed");
var _global = (typeof window === 'undefined' ? global : window);
// Reset the test providers and the fake async zone before each test.
if (_global.beforeEach) {
    _global.beforeEach(function () {
        test_bed_1.TestBed.resetTestingModule();
        fake_async_1.resetFakeAsyncZone();
    });
}
// TODO(juliemr): remove this, only used because we need to export something to have compilation
// work.
exports.__core_private_testing_placeholder__ = '';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVmb3JlX2VhY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Rpbmcvc3JjL2JlZm9yZV9lYWNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7Ozs7R0FJRztBQUVILDJDQUFnRDtBQUNoRCx1Q0FBbUM7QUFJbkMsSUFBTSxPQUFPLEdBQVEsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFdkUscUVBQXFFO0FBQ3JFLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtJQUN0QixPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ2pCLGtCQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM3QiwrQkFBa0IsRUFBRSxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFFRCxnR0FBZ0c7QUFDaEcsUUFBUTtBQUNLLFFBQUEsb0NBQW9DLEdBQUcsRUFBRSxDQUFDIn0=