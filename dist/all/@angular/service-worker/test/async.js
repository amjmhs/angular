"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function wrap(fn) {
    return function (done) { fn().then(function () { return done(); }).catch(function (err) { return done.fail(err); }); };
}
function async_beforeAll(fn) {
    beforeAll(wrap(fn));
}
exports.async_beforeAll = async_beforeAll;
function async_beforeEach(fn) {
    beforeEach(wrap(fn));
}
exports.async_beforeEach = async_beforeEach;
function async_it(desc, fn) {
    it(desc, wrap(fn));
}
exports.async_it = async_it;
function async_fit(desc, fn) {
    // tslint:disable-next-line:no-jasmine-focus
    fit(desc, wrap(fn));
}
exports.async_fit = async_fit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci90ZXN0L2FzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsY0FBYyxFQUF1QjtJQUNuQyxPQUFPLFVBQUMsSUFBWSxJQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsSUFBSSxFQUFFLEVBQU4sQ0FBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRixDQUFDO0FBRUQseUJBQWdDLEVBQXVCO0lBQ3JELFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBRkQsMENBRUM7QUFFRCwwQkFBaUMsRUFBdUI7SUFDdEQsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFGRCw0Q0FFQztBQUVELGtCQUF5QixJQUFZLEVBQUUsRUFBdUI7SUFDNUQsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBRkQsNEJBRUM7QUFFRCxtQkFBMEIsSUFBWSxFQUFFLEVBQXVCO0lBQzdELDRDQUE0QztJQUM1QyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFIRCw4QkFHQyJ9